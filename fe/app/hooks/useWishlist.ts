"use client";

import { useCallback, useState } from "react";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/app/lib/api";

export function useWishlist(token: string | null) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getWishlist(token);
      setWishlist(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const add = useCallback(
    async (productId: number) => {
      if (!token) return;
      try {
        await addToWishlist(productId, token);
        await fetchWishlist();
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
      }
    },
    [token, fetchWishlist]
  );

  const remove = useCallback(
    async (itemId: number) => {
      if (!token) return;
      try {
        await removeFromWishlist(itemId, token);
        await fetchWishlist();
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
      }
    },
    [token, fetchWishlist]
  );

  const isInWishlist = useCallback(
    (productId: number) => {
      return wishlist.some((item) => item.product_id === productId);
    },
    [wishlist]
  );

  return {
    wishlist,
    loading,
    fetchWishlist,
    add,
    remove,
    isInWishlist,
  };
}
