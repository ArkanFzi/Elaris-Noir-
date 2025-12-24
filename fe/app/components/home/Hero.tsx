"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useState, useEffect, useRef, useCallback } from "react";

export function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false); // Track if video has already loaded

  useEffect(() => {
    // Ensure video plays after component mounts
    const video = videoRef.current;
    if (video) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        video.play().catch((error) => {
          console.log("Video autoplay prevented:", error);
          // Fallback will remain visible if autoplay fails
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleVideoReady = useCallback(() => {
    // Only set loaded state once to prevent multiple re-renders
    if (!hasLoadedRef.current) {
      console.log("Video is ready to play");
      hasLoadedRef.current = true;
      setVideoLoaded(true);
    }
  }, []); // Empty dependency array - function never changes

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Animated Gradient Background (Fallback) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-[#0a1628] to-midnight animate-gradient-shift" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 scale-105" 
             style={{ filter: "brightness(0.4)" }}
             aria-hidden="true" />
      </div>

      {/* Video Background (if available) */}
      <div className={`absolute inset-0 z-[1] transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          onError={(e) => {
            console.error("Video failed to load:", e);
            setVideoLoaded(false);
          }}
        >
          {/* Local video source */}
          <source src="/HeroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Gradient Overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight z-10" />

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
