"use client";

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds if not already closed/subscribed
    const timer = setTimeout(() => {
        const hasSeenPopup = sessionStorage.getItem("elaris_newsletter_seen");
        if (!hasSeenPopup) {
            setIsOpen(true);
        }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("elaris_newsletter_seen", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={handleClose}
             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
           />

           {/* Modal */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="relative bg-midnight border border-gold/20 w-full max-w-lg p-8 md:p-12 text-center shadow-2xl overflow-hidden"
           >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <Mail className="w-8 h-8 text-gold mx-auto mb-6" />
                
                <h3 className="font-serif text-3xl text-white mb-3">The Inner Circle</h3>
                <p className="text-gray-400 font-light mb-8">
                    Join our exclusive list for early access to new collections and receive <span className="text-gold">10% off</span> your first order.
                </p>

                <div className="flex flex-col gap-3">
                    <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="w-full bg-white/5 border border-white/10 p-3 text-center text-white focus:border-gold focus:outline-none placeholder:text-gray-600"
                    />
                    <button 
                        onClick={handleClose}
                        className="w-full bg-gold text-midnight uppercase tracking-widest text-xs font-bold py-4 hover:bg-white transition-colors"
                    >
                        Sign Up
                    </button>
                </div>
                
                <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest cursor-pointer hover:text-gray-400" onClick={handleClose}>
                    No thanks, I prefer full price
                </p>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
