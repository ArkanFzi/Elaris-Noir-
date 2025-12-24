"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
  overlayOpacity?: number;
}

export function PageHero({ title, subtitle, image, overlayOpacity = 60 }: PageHeroProps) {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-black z-10" style={{ opacity: overlayOpacity / 100 }} />
             <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                src={image} 
                alt={title} 
                className="w-full h-full object-cover" 
             />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6">
            <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm block mb-4"
            >
                {subtitle}
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-4xl md:text-6xl text-white"
            >
                {title}
            </motion.h1>
        </div>
    </section>
  );
}
