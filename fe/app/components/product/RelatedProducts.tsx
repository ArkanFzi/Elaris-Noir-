"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/app/components/ui/ProductCard";
import { getProducts } from "@/app/lib/api";

type Product = {
  id: number;
  name: string;
  category: string;
  price_cents: number;
  image_url: string;
};

interface RelatedProductsProps {
  currentProductId?: string | number;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await getProducts();
        // Filter out current product and return top 3
        const filtered = (data || [])
          .filter((p: Product) => p.id.toString() !== currentProductId?.toString())
          .slice(0, 3);
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentProductId]);

  if (loading) {
    return (
      <section className="py-24">
        <h2 className="font-serif text-3xl text-white mb-12">You May Also Like</h2>
        <div className="text-gray-400">Loading recommendations...</div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24">
       <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl text-white">You May Also Like</h2>
       </div>
       
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
    </section>
  );
}
