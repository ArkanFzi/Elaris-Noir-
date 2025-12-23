'use client';

import { useCart } from "@/app/context/CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartDrawer() {
  const { isOpen, closeCart, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-midnight border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-serif text-2xl text-gold">Your Cart ({cartCount})</h2>
              <button onClick={closeCart} className="text-mist hover:text-gold transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                       <span className="text-2xl">🛍️</span>
                  </div>
                  <p className="text-gray-400">Your cart is empty.</p>
                  <Button variant="outline" onClick={closeCart}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mock Item */}
                  <div className="flex gap-4">
                    <div className="w-20 h-24 bg-white/5 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif text-lg text-white">Midnight Bloom</h3>
                        <p className="text-gold">$180</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">50ml / 1.7oz</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-white/20 rounded-sm">
                          <button className="p-1 hover:text-gold"><Minus className="w-4 h-4" /></button>
                          <span className="px-2 text-sm">1</span>
                          <button className="p-1 hover:text-gold"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button className="text-gray-500 hover:text-red-400 ml-auto">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-midnight-light">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">$180.00</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-light">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full" size="lg" variant="gold">
                  Checkout
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
