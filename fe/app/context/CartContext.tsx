"use client";

import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price_cents: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setCartCount((prev) => prev + 1);
    setIsOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        cartCount,
        cartItems,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
