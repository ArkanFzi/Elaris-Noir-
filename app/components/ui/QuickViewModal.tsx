"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { useSearch } from "@/app/context/SearchContext";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView } = useSearch();
  const { openCart } = useCart();

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    // In production, this would add to cart
    closeQuickView();
    openCart();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
        onClick={closeQuickView}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-midnight border border-gold/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-10 p-2 bg-midnight/80 hover:bg-midnight border border-white/10 hover:border-gold/50 rounded-full transition-colors"
            aria-label="Close quick view"
          >
            <X className="w-5 h-5 text-mist" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-white/5 relative overflow-hidden">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="flex-1">
                <span className="text-gold text-xs uppercase tracking-widest">
                  {quickViewProduct.category}
                </span>
                <h2 className="font-serif text-4xl text-white mt-4 mb-6">
                  {quickViewProduct.name}
                </h2>
                <p className="text-3xl text-gold mb-8">
                  ${quickViewProduct.price}
                </p>

                <p className="text-gray-400 leading-relaxed mb-8">
                  {quickViewProduct.description || "A luxurious fragrance that captures the essence of elegance and sophistication. Crafted with the finest ingredients from around the world."}
                </p>

                {/* Scent Notes */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                    Scent Notes
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-gold rounded-full" />
                      <span className="text-gray-400">Top: Bergamot, Black Currant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-gold rounded-full" />
                      <span className="text-gray-400">Heart: Turkish Rose, Jasmine</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-gold rounded-full" />
                      <span className="text-gray-400">Base: Amber, Oud, Vanilla</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Link href={`/product/${quickViewProduct.id}`} onClick={closeQuickView}>
                  <Button variant="outline" size="lg" className="w-full">
                    View Full Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
