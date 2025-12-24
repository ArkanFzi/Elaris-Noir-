"use client";

import { useRef, useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Story() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Section Refs for Navigation
  const legacyRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);

  const [activeSection, setActiveSection] = useState("legacy");

  // Simple scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        if (valuesRef.current && scrollPosition >= valuesRef.current.offsetTop) {
            setActiveSection("values");
        } else if (processRef.current && scrollPosition >= processRef.current.offsetTop) {
            setActiveSection("process");
        } else if (legacyRef.current && scrollPosition >= legacyRef.current.offsetTop) {
            setActiveSection("legacy");
        }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-midnight text-mist selection:bg-gold selection:text-midnight overflow-x-hidden">
      <Navbar />

      {/* Chapter Navigation (Sticky Right) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6">
        {[
            { id: "legacy", label: "Legacy", ref: legacyRef },
            { id: "process", label: "Process", ref: processRef },
            { id: "values", label: "Values", ref: valuesRef }
        ].map((item) => (
            <button
                key={item.id}
                onClick={() => scrollTo(item.ref)}
                className="group flex items-center gap-4 cursor-pointer relative"
            >
                <span className={cn(
                    "text-[10px] uppercase tracking-widest font-medium transition-all duration-300 absolute right-8 opacity-0 group-hover:opacity-100",
                    activeSection === item.id ? "text-gold opacity-100" : "text-gray-500"
                )}>
                    {item.label}
                </span>
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                    activeSection === item.id ? "bg-gold scale-150" : "bg-white/20 group-hover:bg-white/50"
                )} />
            </button>
        ))}
      </div>
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-midnight z-10" />
             <img 
                src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2670&auto=format&fit=crop" 
                alt="Story Hero" 
                crossOrigin="anonymous"
                className="w-full h-full object-cover scale-110" 
             />
        </motion.div>

        <div className="relative z-20 text-center px-6">
            <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-gold uppercase tracking-[0.4em] text-xs md:text-sm block mb-6"
            >
                Our Essence
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mix-blend-overlay"
            >
                The Legacy
            </motion.h1>
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute bottom-[-20vh] left-1/2 -translate-x-1/2"
             >
                 <div className="w-[1px] h-24 bg-gradient-to-b from-white/0 via-gold to-white/0" />
             </motion.div>
        </div>
      </section>

      {/* Chapter 1: The Beginning */}
      <section ref={legacyRef} className="py-32 container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-10"
            >
                <div className="inline-block border border-gold/30 px-4 py-2 rounded-full">
                    <span className="text-gold text-xs uppercase tracking-widest">Chapter I</span>
                </div>
                <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">Parisian Roots, <br/><span className="text-gold italic">Global Spirit</span></h2>
                <div className="w-24 h-[1px] bg-gold/50" />
                <p className="text-xl font-light leading-relaxed text-gray-300">
                    Founded in the heart of Le Marais, Elaris Noir began as a whispered secret among the Parisian elite. It was born from a singular obsession: to capture the fleeting beauty of the night in a bottle.
                </p>
                <p className="text-lg font-light leading-relaxed text-gray-400">
                    We believe that perfume is not just a scent, but a memory, an emotion, an invisible armor that you wear. Our founder, intrigued by the interplay of shadow and light, sought to create fragrances that embody the mystery of the evening hours.
                </p>
            </motion.div>
            
            <div className="relative aspect-[3/4] overflow-hidden group">
                 <div className="absolute inset-0 border border-gold/20 z-20 m-4 transition-all duration-700 group-hover:m-2 group-hover:border-gold/50" />
                 <motion.div 
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full"
                 >
                    <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop" alt="Parisian Streets" crossOrigin="anonymous" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                 </motion.div>
            </div>
        </div>
      </section>

      {/* Chapter 2: The Process (Video Background) */}
      <section ref={processRef} className="py-40 relative overflow-hidden bg-black">
         {/* Video Background Placeholder */}
         <div className="absolute inset-0 z-0 opacity-60">
            <video 
                autoPlay 
                muted 
                loop 
                playsInline
                crossOrigin="anonymous"
                poster="https://images.unsplash.com/photo-1615114709879-113aa05e8396?q=80&w=2670&auto=format&fit=crop"
                className="w-full h-full object-cover scale-105"
            >
                <source src="https://videos.pexels.com/video-files/5630656/5630656-hd_1920_1080_24fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-midnight/60 mix-blend-multiply" />
         </div>

         <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">
             <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
             >
                <div className="inline-block border border-white/20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full mb-8">
                    <span className="text-white text-xs uppercase tracking-widest">Chapter II</span>
                </div>
                <h2 className="font-serif text-5xl md:text-7xl text-white mb-20">Alchemy & Artistry</h2>
             </motion.div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                 {[
                    { title: "Sourcing", desc: "We travel from the Oud markets of Dubai to the Rose fields of Grasse.", icon: "I" },
                    { title: "Blending", desc: "A meticulous process where time is the most essential ingredient.", icon: "II" },
                    { title: "Aging", desc: "Allowing the notes to marry and mature into liquid gold.", icon: "III" }
                 ].map((item, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        className="bg-midnight/40 backdrop-blur-lg border border-white/5 p-10 hover:border-gold/30 transition-colors duration-500 group"
                     >
                         <span className="font-serif text-5xl text-white group-hover:text-gold font-bold block mb-6 transition-colors">{item.icon}</span>
                         <h3 className="font-serif text-2xl text-white mb-4">{item.title}</h3>
                         <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
                     </motion.div>
                 ))}
             </div>
         </div>
      </section>

      {/* Chapter 3: Sustainability */}
      <section ref={valuesRef} className="py-32 container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 relative aspect-square"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2670&auto=format&fit=crop" alt="Raw Ingredients" crossOrigin="anonymous" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 md:order-2 space-y-10"
            >
                <div className="inline-block border border-gold/30 px-4 py-2 rounded-full">
                    <span className="text-gold text-xs uppercase tracking-widest">Chapter III</span>
                </div>
                <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">Conscious <span className="text-gold">Luxury</span></h2>
                <p className="text-xl font-light leading-relaxed text-gray-300">
                    True luxury respects the earth. We are committed to sustainable sourcing, ensuring that every petal, root, and resin is harvested with care for nature and the communities that cultivate them.
                </p>
                <ul className="space-y-6 mt-8">
                    {["Cruelty-Free Formulas", "Recyclable Glass Flacons", "Ethically Sourced Ingredients"].map((item, i) => (
                        <li key={i} className="flex items-center gap-6 text-white/80 font-light group">
                            <span className="w-2 h-2 bg-gold rounded-full group-hover:scale-150 transition-transform" /> 
                            <span className="group-hover:text-gold transition-colors">{item}</span>
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
