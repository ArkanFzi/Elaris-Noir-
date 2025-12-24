"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Hero } from "@/app/components/home/Hero";
import { Featured } from "@/app/components/home/Featured";
import { Spotlight } from "@/app/components/home/Spotlight";
import { Ingredients } from "@/app/components/home/Ingredients";
import { JournalPreview } from "@/app/components/home/JournalPreview";
import { Testimonials } from "@/app/components/home/Testimonials";

// Visual Divider Component
function Divider() {
  return (
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent my-16 md:my-24"
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight text-mist selection:bg-gold selection:text-midnight">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>
      
      <Divider />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Spotlight />
      </motion.div>
      
      <Divider />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Featured />
      </motion.div>
      
      <Divider />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Ingredients />
      </motion.div>
      
      <Divider />
      
      {/* Brand Story Teaser */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-fixed opacity-20" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl text-gold mb-6 italic">&ldquo;A symphony of notes, composed for the bold.&rdquo;</h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300 mb-10">
            Elaris Noir isn&apos;t just a fragrance; it&apos;s a statement. Born from the desire to capture the elegance of the night, we blend rare ingredients to create scents that linger in memory.
          </p>
          <Link href="/our-story" className="inline-block border-b border-gold text-gold pb-1 hover:text-white transition-colors uppercase tracking-widest text-sm">
            Read Our Story
          </Link>
        </div>
      </motion.section>

      <Divider />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Testimonials />
      </motion.div>
      
      <Divider />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <JournalPreview />
      </motion.div>

      <Footer />
    </main>
  );
}
