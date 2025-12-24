"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface ResultProps {
  scentProfile: string;
}

// Mock data mapping profiles to products
const recommendations: Record<string, { name: string; description: string; image: string; id: string }> = {
  floral: {
    name: "Midnight Bloom",
    description: "A daring composition of Turkish Rose and Black Currant managed by the depth of Amber. Perfect for the romantic soul.",
    image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=2670&auto=format&fit=crop",
    id: "1",
  },
  woody: {
    name: "Obsidion Wood",
    description: "Deep, mysterious, and grounding. Notes of Oud, Cedarwood, and minimal Vanilla create an aura of authority.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    id: "2",
  },
  fresh: {
    name: "Crystalline Mist",
    description: "As crisp as the morning air in the Alps. Citrus top notes with a clean musk base for effortless elegance.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
    id: "3",
  },
  oriental: {
    name: "Golden Amber",
    description: "Rich, spicy, and infinitely warm. A luxurious blend of Saffron, Vanilla, and Tobacco Leaf.",
    image: "https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=2670&auto=format&fit=crop",
    id: "4",
  },
};

export function QuizResults({ scentProfile }: ResultProps) {
  // Fallback to 'floral' if profile not found
  const result = recommendations[scentProfile] || recommendations.floral;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
          Your Signature Scent
        </span>
        
        <h2 className="font-serif text-4xl md:text-6xl text-white mb-8">
          {result.name}
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
            <motion.div 
                className="w-full md:w-1/2 aspect-[4/5] relative overflow-hidden rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <img 
                    src={result.image} 
                    alt={result.name}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
            </motion.div>
            
            <div className="w-full md:w-1/2 text-left">
                <h3 className="text-gold text-xl font-serif mb-4">The Match</h3>
                <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
                    {result.description}
                </p>
                
                <div className="flex flex-col gap-4">
                    <Link href={`/product/${result.id}`}>
                        <Button size="lg" variant="gold" className="w-full md:w-auto">
                            Shop {result.name} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/quiz">
                         <Button variant="ghost" className="w-full md:w-auto text-sm" onClick={() => window.location.reload()}>
                            Retake Quiz
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
