"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductCard } from "@/app/components/ui/ProductCard";
import { useWishlist } from "@/app/context/WishlistContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { PageHero } from "@/app/components/ui/PageHero";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <PageHero 
        title="My Wishlist" 
        subtitle="Your Curated Collection"
        image="https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop"
      />
      
      <div className="pt-16 pb-12 text-center container mx-auto px-6">
        <p className="text-gray-400 font-light">Saved essences to explore.</p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {wishlist.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image}
                    delay={index * 0.05}
                />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 min-h-[40vh] bg-white/5 rounded-sm border border-dashed border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-gold/50" />
                </div>
                <p className="text-lg mb-6">Your wishlist is currently empty.</p>
                <Link href="/collection">
                    <Button variant="gold">Explore Collection</Button>
                </Link>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
