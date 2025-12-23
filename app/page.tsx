import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Hero } from "@/app/components/home/Hero";
import { Featured } from "@/app/components/home/Featured";
import { Spotlight } from "@/app/components/home/Spotlight";
import { Ingredients } from "@/app/components/home/Ingredients";
import { JournalPreview } from "@/app/components/home/JournalPreview";
import { Testimonials } from "@/app/components/home/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight text-mist selection:bg-gold selection:text-midnight">
      <Navbar />
      <Hero />
      
      <Spotlight />
      <Featured />
      <Ingredients />
      
      {/* Brand Story Teaser */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-fixed opacity-20" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl text-gold mb-6 italic">"A symphony of notes, composed for the bold."</h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300 mb-10">
            Elaris Noir isn't just a fragrance; it's a statement. Born from the desire to capture the elegance of the night, we blend rare ingredients to create scents that linger in memory.
          </p>
          <Link href="/our-story" className="inline-block border-b border-gold text-gold pb-1 hover:text-white transition-colors uppercase tracking-widest text-sm">
            Read Our Story
          </Link>
        </div>
      </section>

      <Testimonials />
      <JournalPreview />

      <Footer />
    </main>
  );
}
