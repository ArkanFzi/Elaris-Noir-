"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { useCart } from "@/app/context/CartContext";
import { useSearch } from "@/app/context/SearchContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { openSearch } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collection", href: "/collection" },
    { name: "Our Story", href: "/our-story" },
    { name: "Journal", href: "/journal" },
    { name: "Contact", href: "/contact" },
    { name: "Find Scent", href: "/quiz" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-midnight/90 backdrop-blur-md border-white/5 py-4 shadow-xl" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-gold z-50">
          ELARIS NOIR
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest text-mist hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={openSearch} className="text-mist hover:text-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/account/wishlist" className="text-mist hover:text-gold transition-colors">
            <Heart className="w-5 h-5" />
          </Link>
          <button onClick={toggleCart} className="relative text-mist hover:text-gold transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gold text-midnight text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-mist z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-midnight z-40 flex flex-col items-center justify-center gap-8 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl text-mist hover:text-gold"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-6 mt-4">
               <button className="text-mist hover:text-gold">
                <Search className="w-6 h-6" />
              </button>
              <button onClick={toggleCart} className="relative text-mist hover:text-gold">
                <ShoppingBag className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
