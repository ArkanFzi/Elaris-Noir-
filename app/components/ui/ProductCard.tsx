"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string | number;
  title: string;
  category?: string;
  price: string;
  image: string;
  delay?: number;
}

import { useWishlist } from "@/app/context/WishlistContext";
import { Heart } from "lucide-react";

// ... inside component ...
export function ProductCard({ id, title, category, price, image, delay = 0 }: ProductCardProps) {
  const { toggleCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(); 
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isWishlisted) {
          removeFromWishlist(id);
      } else {
          addToWishlist({ id, name: title, price, image, category });
      }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      className="group group-hover:z-10 relative"
    >
      <Link href={`/product/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-4">
            <div className="absolute inset-0 bg-gray-800 animate-pulse" /> {/* Placeholder */}
            
            {/* Wishlist Button */}
            <button 
                onClick={handleWishlistToggle}
                className="absolute top-3 right-3 z-20 text-white/50 hover:text-gold transition-colors"
            >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-gold text-gold" : ""}`} />
            </button>

            {/* Image */}
            <motion.div 
                className="absolute inset-0 w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            >
               <img 
                 src={image} 
                 alt={title} 
                 className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
               />
            </motion.div>

            {/* Quick Add Overlay - Minimalist */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <button
                    onClick={handleQuickAdd}
                    className="w-full bg-white/90 backdrop-blur-sm text-midnight uppercase tracking-widest text-xs py-3 hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-3 h-3" /> Quick Add
                </button>
            </div>
        </div>

        {/* Info - Minimalist & Centered or Left Aligned (Going with Left for 'Strong' feel) */}
        <div className="space-y-1">
            {category && (
                <p className="text-[10px] uppercase tracking-widest text-gold/80 mb-1">{category}</p>
            )}
            <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-300 transform group-hover:translate-x-1 inline-block">
                {title}
            </h3>
            <p className="text-sm font-light text-gray-400 group-hover:text-white transition-colors">
                {price}
            </p>
        </div>
      </Link>
    </motion.div>
  );
}
