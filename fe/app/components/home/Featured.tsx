"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/app/components/ui/ProductCard";
import { getProducts } from "@/app/lib/api";

type Product = {
  id: number;
  name: string;
  category: string;
  price_cents: number;
  image_url: string;
};

export function Featured() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts();
        setProducts(data ? data.slice(0, 3) : []);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-midnight">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-gold uppercase tracking-widest text-sm mb-2">Selection</p>
            <h2 className="font-serif text-4xl md:text-5xl text-mist">Featured Scents</h2>
          </div>
          <Link href="/collection" className="hidden md:flex items-center gap-2 text-gold hover:text-white transition-colors uppercase text-sm tracking-widest group">
            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Curating our selection...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
               <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  category={product.category}
                  price={`$${(product.price_cents / 100).toFixed(2)}`}
                  image={product.image_url}
                  delay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Discoveries coming soon.</p>
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/collection" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors uppercase text-sm tracking-widest">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
