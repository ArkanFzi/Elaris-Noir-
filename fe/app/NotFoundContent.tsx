"use client";

import Link from "next/link";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/ui/Button";

export function NotFoundContent() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <div className="w-full py-6 border-b border-white/5 bg-midnight-light">
          <div className="container mx-auto px-6 font-serif text-xl font-bold tracking-widest text-gold text-center">
            ELARIS NOIR
          </div>
      </div>
       <div className="pt-32 pb-24 container mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-gold font-serif text-6xl md:text-8xl mb-4">404</div>
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-6">Page Not Found</h1>
            <p className="text-gray-400 mb-8 max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link href="/">
                <Button variant="gold" size="lg">Return to Home</Button>
            </Link>
       </div>
      <Footer />
    </main>
  );
}
