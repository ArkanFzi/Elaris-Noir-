"use client";

import { motion } from "framer-motion";

const ingredients = [
  {
    id: 1,
    name: "Oud Wood",
    origin: "Southeast Asia",
    description: "Rich, resinous, and deeply complex.",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Turkish Rose",
    origin: "Isparta",
    description: "Opulent, romantic, and velvety.",
    image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Ambergris",
    origin: "Oceanic",
    description: "Warm, marine, and enduring.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop"
  }
];

export function Ingredients() {
  return (
    <section className="py-24 md:py-32 bg-midnight text-mist">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
            <span className="text-gold uppercase tracking-[0.2em] text-xs block mb-4">The Alchemist&apos;s Palette</span>
            <h2 className="font-serif text-4xl md:text-5xl">Rare Ingredients</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {ingredients.map((item, index) => (
                <motion.div 
                    key={item.id}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="group relative h-[500px] overflow-hidden"
                >
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-midnight via-transparent to-transparent">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <p className="text-gold/80 text-xs uppercase tracking-widest mb-2">{item.origin}</p>
                             <h3 className="font-serif text-3xl mb-3 text-white">{item.name}</h3>
                             <p className="text-gray-300 font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                {item.description}
                             </p>
                        </div>
                        <div className="h-[1px] w-12 bg-gold mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
