"use client";

import { Button } from "@/app/components/ui/Button";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const { cartCount, closeCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Close cart drawer if open when landing here
  useEffect(() => {
     if (closeCart) closeCart();
  }, [closeCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push("/checkout/success");
  };

  return (
    <div className="container mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-white">Contact Information</h2>
              <input type="email" required placeholder="Email address" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-white">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required placeholder="First name" className="bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                <input type="text" required placeholder="Last name" className="bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
              </div>
              <input type="text" required placeholder="Address" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required placeholder="City" className="bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                <input type="text" required placeholder="Postal code" className="bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
               <h2 className="font-serif text-2xl text-white">Payment</h2>
               <div className="p-4 border border-white/10 rounded-sm bg-white/5 text-center text-sm text-gray-400">
                  Payment Gateway Integration Coming Soon.
                  <br />
                  <span className="text-gold">Proceeding will simulate a successful transaction.</span>
               </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 p-8 rounded-sm h-fit">
             <h2 className="font-serif text-xl text-white mb-6">Order Summary</h2>
             
             {cartCount === 0 ? (
                <p className="text-gray-400 text-sm">Your cart is empty.</p>
             ) : (
                 <div className="space-y-4 mb-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-midnight border border-white/10 rounded-sm overflow-hidden relative">
                             <img src="https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop" alt="Product" crossOrigin="anonymous" className="w-full h-full object-cover" />
                             <span className="absolute top-0 right-0 bg-gold text-midnight text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/2 -translate-y-1/2">1</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">Midnight Bloom</h4>
                            <p className="text-xs text-gray-400">50ml / 1.7oz</p>
                        </div>
                        <p className="text-sm text-white">$180.00</p>
                    </div>
                 </div>
             )}

             <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>$180.00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                </div>
                 <div className="flex justify-between text-white font-medium text-lg pt-4 border-t border-white/10 mt-4">
                    <span>Total</span>
                    <span className="text-gold">$180.00</span>
                </div>
             </div>
          </div>
        </form>
    </div>
  );
}
