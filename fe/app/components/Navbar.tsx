"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/context/CartContext";
import { useSearch } from "@/app/context/SearchContext";
import { useAuth } from "@/app/context/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { openSearch } = useSearch();
  const { token, user, logout } = useAuth();

  console.log("Navbar: Render", { token, user });

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
        isScrolled
          ? "bg-midnight/90 backdrop-blur-md border-white/5 py-4 shadow-xl"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-gold z-50"
        >
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
          <button
            onClick={openSearch}
            className="text-mist hover:text-gold transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/account/wishlist"
            className="text-mist hover:text-gold transition-colors"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <button
            onClick={toggleCart}
            className="relative text-mist hover:text-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gold text-midnight text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm text-mist hidden lg:inline-block">
                  Hi, {user?.first_name}
                </span>
                <Link
                  href={user?.role === "admin" ? "/admin" : "/account"}
                  className="flex items-center gap-2 text-mist hover:text-gold transition-colors"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="font-serif text-sm">{user?.first_name?.[0]}</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors ml-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm uppercase tracking-widest text-mist hover:text-gold transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gold text-midnight text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-mist z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
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
              <button
                onClick={toggleCart}
                className="relative text-mist hover:text-gold"
              >
                <ShoppingBag className="w-6 h-6" />
              </button>
            </div>
            {/* Auth Buttons - Mobile */}
            <div className="flex flex-col gap-4 w-full px-6">
              {token ? (
                <>
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold font-serif text-lg">
                      {user?.first_name?.[0]}
                    </div>
                    <span className="text-mist">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <Link
                     href={user?.role === "admin" ? "/admin" : "/account"}
                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-center text-mist hover:text-gold transition-colors uppercase tracking-widest text-sm"
                     onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded text-center text-red-400 hover:bg-red-500/20 transition-colors uppercase tracking-widest text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 border border-white/20 rounded text-center text-white hover:border-gold hover:text-gold transition-colors uppercase tracking-widest text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 bg-gold text-midnight rounded text-center text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
