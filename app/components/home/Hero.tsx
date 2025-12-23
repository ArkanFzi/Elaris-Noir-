"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background (Gradient Overlay + Image placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/10 to-midnight z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=2670&auto=format&fit=crop')", // Placeholder luxury perfume image
          filter: "brightness(0.6)"
        }}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="text-gold uppercase tracking-[0.2em] text-sm md:text-base mb-4 font-medium">
            The Essence of Elegance
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-9xl text-mist font-medium mb-8 leading-tight"
        >
          ELARIS <br /> NOIR
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link href="/collection">
            <Button size="lg" variant="gold" className="min-w-[200px]">
                Shop Collection
            </Button>
          </Link>
          <Link href="/our-story">
            <Button size="lg" variant="outline" className="min-w-[200px]">
                Discover Story
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
