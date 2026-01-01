"use client";

import { Button } from "@/app/components/ui/Button";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import { Heart } from "lucide-react";

interface ProductActionsProps {
  product: {
    id: string | number;
    name: string;
    price: string;
    image: string;
    category?: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toggleCart, addToCart } = useCart();
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    // Parse price string (e.g., "$180") to cents
    // Basic parsing: remove non-digits.
    const numericPrice = parseInt(product.price.toString().replace(/[^0-9]/g, ""));
    // If string was "$180", we got 180. We need cents, so * 100.
    // However, if the source was already cents (number), we might double multiply.
    // Given the current static data is "$180", we assume it's dollars.
    const priceCents = numericPrice * 100;

    addToCart({
      id: product.id.toString(),
      name: product.name,
      price_cents: priceCents,
      image_url: product.image,
      quantity: 1
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <Button size="lg" className="w-full sm:w-auto px-12" onClick={handleAddToCart}>
        Add to Cart
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className={`w-full sm:w-auto flex items-center gap-2 ${isWishlisted ? "border-gold text-gold" : ""}`} 
        onClick={handleWishlistToggle}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        {isWishlisted ? "Saved" : "Wishlist"}
      </Button>
    </div>
  );
}
