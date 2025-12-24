"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/app/components/ui/ProductCard";

const products = [
  {
    id: 1,
    name: "Midnight Bloom",
    category: "Eau de Parfum",
    price: "$180",
    image: "https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Golden Amber",
    category: "Eau de Parfum",
    price: "$210",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Velvet Rose",
    category: "Eau de Parfum",
    price: "$195",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
  },
];

export function Featured() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
             <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
                delay={index * 0.1}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/collection" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors uppercase text-sm tracking-widest">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
