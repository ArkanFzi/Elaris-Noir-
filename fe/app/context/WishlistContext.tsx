"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "@/app/lib/api";

interface WishlistItem {
  id: number | string;
  name: string;
  price: string;
  image: string;
  category?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: number | string) => Promise<void>;
  isInWishlist: (productId: number | string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        // Fallback to local storage if not logged in
        const saved = localStorage.getItem("elaris_wishlist");
        if (saved) {
          try {
            setWishlist(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse local wishlist", e);
          }
        }
        return;
      }

      try {
        const data = await getWishlist(token);
        // Map backend models.WishlistItem to frontend WishlistItem
        const items = (data || []).map((item: { id: number; product: { id: number; name: string; category: string; price_cents: number; image_url: string } }) => ({
          id: item.product.id,
          name: item.product.name,
          price: `$${(item.product.price_cents / 100).toFixed(2)}`,
          image: item.product.image_url,
          category: item.product.category,
          wishlist_item_id: item.id
        }));
        setWishlist(items);
      } catch (error) {
        console.error("Failed to fetch wishlist from server", error);
      }
    };

    fetchWishlist();
  }, [token]);

  // Save to localStorage only if not logged in
  useEffect(() => {
    if (!token) {
      localStorage.setItem("elaris_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, token]);

  const addToWishlist = async (item: WishlistItem) => {
    if (token) {
      try {
        await apiAddToWishlist(Number(item.id), token);
        // Refresh wishlist from server to get correct data
        const data = await getWishlist(token);
        const items = data.map((item: { id: number; product: { id: number; name: string; category: string; price_cents: number; image_url: string } }) => ({
          id: item.product.id,
          name: item.product.name,
          price: `$${(item.product.price_cents / 100).toFixed(2)}`,
          image: item.product.image_url,
          category: item.product.category,
          wishlist_item_id: item.id
        }));
        setWishlist(items);
        return;
      } catch (error) {
        console.error("Failed to add to server wishlist", error);
      }
    }

    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = async (productId: number | string) => {
    if (token) {
      try {
        const itemToRemove = wishlist.find(i => i.id === productId);
        const wishlistItemId = (itemToRemove as any)?.wishlist_item_id;
        if (itemToRemove && wishlistItemId) {
          await apiRemoveFromWishlist(wishlistItemId, token);
          setWishlist((prev) => prev.filter((item) => item.id !== productId));
          return;
        }
      } catch (error) {
        console.error("Failed to remove from server wishlist", error);
      }
    }

    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: number | string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
