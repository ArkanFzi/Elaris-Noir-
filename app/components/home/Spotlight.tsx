"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Spotlight() {
  return (
    <section className="bg-white min-h-[80vh] flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side */}
      <div className="md:w-1/2 relative h-[50vh] md:h-auto">
        <div className="absolute inset-0 bg-neutral-900">
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="w-full h-full"
            >
                <img 
                    src="https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=2670&auto=format&fit=crop" 
                    alt="Elaris Noir Signature" 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
                />
            </motion.div>
        </div>
      </div>

      {/* Content Side */}
      <div className="md:w-1/2 bg-mist text-midnight flex items-center p-8 md:p-24">
        <div className="max-w-xl">
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-gold uppercase tracking-[0.2em] text-sm mb-6 font-medium"
            >
                In The Spotlight
            </motion.p>
            
            <motion.h2 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="font-serif text-5xl md:text-6xl mb-8 leading-tight"
            >
                Midnight <br/> Bloom
            </motion.h2>
            
            <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 text-lg font-light leading-relaxed mb-10"
            >
                A daring composition that captures the essence of a Parisian night. 
                With top notes of Black Currant and Bergamot, melting into a heart 
                of Turkish Rose, and settling on a base of deep Amber and Oud. 
                Designed for those who embrace the darkness as much as the light.
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
            >
                <Link href="/product/1" className="inline-flex items-center gap-3 text-midnight border-b border-midnight pb-1 uppercase tracking-widest text-sm hover:text-gold hover:border-gold transition-colors duration-300">
                    Discover The Scent <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
