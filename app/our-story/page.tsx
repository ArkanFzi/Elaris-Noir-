"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { motion } from "framer-motion";

export default function Story() {
  return (
    <main className="min-h-screen bg-midnight text-mist selection:bg-gold selection:text-midnight overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-black/60 z-10" />
             <img 
                src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2670&auto=format&fit=crop" 
                alt="Story Hero" 
                className="w-full h-full object-cover" 
             />
        </div>
        <div className="relative z-20 text-center px-6">
            <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-gold uppercase tracking-[0.3em] text-sm block mb-4"
            >
                Our Essence
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl text-white"
            >
                The Elaris Legacy
            </motion.h1>
        </div>
      </section>

      {/* Chapter 1: The Beginning */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
            >
                <h2 className="font-serif text-4xl text-white">Parisian Roots, <br/><span className="text-gold italic">Global Spirit</span></h2>
                <div className="w-20 h-px bg-gold/50" />
                <p className="text-lg font-light leading-relaxed text-gray-300">
                    Founded in the heart of Le Marais, Elaris Noir began as a whispered secret among the Parisian elite. It was born from a singular obsession: to capture the fleeting beauty of the night in a bottle. We believe that perfume is not just a scent, but a memory, an emotion, an invisible armor that you wear.
                </p>
                <p className="text-lg font-light leading-relaxed text-gray-300">
                    Our founder, intrigued by the interplay of shadow and light, sought to create fragrances that embody the mystery of the evening hours—complex, deep, and infinitely sophisticated.
                </p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5]"
            >
                 <div className="absolute inset-0 bg-gold/10 z-10 mix-blend-overlay" />
                 <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop" alt="Parisian Streets" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out" />
            </motion.div>
        </div>
      </section>

      {/* Chapter 2: The Process (Full Width) */}
      <section className="py-24 bg-white/5 relative">
         <div className="container mx-auto px-6 text-center max-w-4xl">
             <span className="text-gold uppercase tracking-widest text-xs mb-4 block">The Process</span>
             <h2 className="font-serif text-4xl md:text-5xl text-white mb-16">Alchemy & Artistry</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                    { title: "Sourcing", desc: "We travel from the Oud markets of Dubai to the Rose fields of Grasse.", icon: "01" },
                    { title: "Blending", desc: "A meticulous process where time is the most essential ingredient.", icon: "02" },
                    { title: "Aging", desc: "Allowing the notes to marry and mature into liquid gold.", icon: "03" }
                 ].map((item, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        className="space-y-4"
                     >
                         <span className="font-serif text-6xl text-white/5 font-bold block">{item.icon}</span>
                         <h3 className="font-serif text-xl text-gold">{item.title}</h3>
                         <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
                     </motion.div>
                 ))}
             </div>
         </div>
      </section>

      {/* Chapter 3: Sustainability */}
      <section className="py-32 container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 relative aspect-square"
            >
                <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2670&auto=format&fit=crop" alt="Raw Ingredients" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 md:order-2 space-y-8"
            >
                <h2 className="font-serif text-4xl text-white">Conscious <span className="text-gold">Luxury</span></h2>
                <p className="text-lg font-light leading-relaxed text-gray-300">
                    True luxury respects the earth. We are committed to sustainable sourcing, ensuring that every petal, root, and resin is harvested with care for nature and the communities that cultivate them.
                </p>
                <ul className="space-y-4">
                    {["Cruelty-Free Formulas", "Recyclable Glass Flacons", "Ethically Sourced Ingredients"].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-gold/80 font-light">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full" /> {item}
                        </li>
                    ))}
                </ul>
            </motion.div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
