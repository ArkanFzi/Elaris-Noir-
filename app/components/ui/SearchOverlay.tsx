"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, ArrowRight } from "lucide-react";
import { useSearch } from "@/app/context/SearchContext";
import Link from "next/link";

// Mock data - in production this would come from API
const mockProducts = [
  { id: "1", name: "Midnight Bloom", price: 180, category: "Floral", image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=400" },
  { id: "2", name: "Obsidion Wood", price: 200, category: "Woody", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400" },
  { id: "3", name: "Crystalline Mist", price: 160, category: "Fresh", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=400" },
  { id: "4", name: "Golden Amber", price: 220, category: "Oriental", image: "https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=400" },
];

const mockArticles = [
  { id: "1", title: "The Art of Layering Fragrances", category: "Guide", date: "Dec 15, 2024" },
  { id: "2", title: "Behind the Scent: Midnight Bloom", category: "Story", date: "Dec 10, 2024" },
  { id: "3", title: "Seasonal Scents for Winter", category: "Guide", date: "Dec 5, 2024" },
];

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter results
  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const filteredArticles = mockArticles.filter(a =>
    a.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen, closeSearch]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-midnight/95 backdrop-blur-xl z-[100] overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl text-gold">Search</h2>
              <button
                onClick={closeSearch}
                className="text-mist hover:text-gold transition-colors p-2"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-16">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, articles..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-14 pr-6 text-white placeholder:text-gray-600 focus:border-gold focus:outline-none text-lg"
                autoFocus
              />
            </div>

            {/* Results */}
            {debouncedQuery && (
              <div className="space-y-12">
                {/* Products */}
                {filteredProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Products ({filteredProducts.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={closeSearch}
                          className="flex gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-lg p-4 transition-all group"
                        >
                          <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-serif text-lg text-white group-hover:text-gold transition-colors">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-gold mt-2">${product.price}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gold transition-colors self-center" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {filteredArticles.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Journal ({filteredArticles.length})</h3>
                    <div className="space-y-4">
                      {filteredArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/journal/${article.id}`}
                          onClick={closeSearch}
                          className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-lg p-4 transition-all group"
                        >
                          <div>
                            <h4 className="text-white group-hover:text-gold transition-colors">{article.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{article.category} · {article.date}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gold transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredProducts.length === 0 && filteredArticles.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No results found for "{debouncedQuery}"</p>
                    <p className="text-gray-600 text-sm mt-2">Try searching for something else</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!debouncedQuery && (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                <p className="text-gray-500 text-lg">Start typing to search</p>
                <p className="text-gray-600 text-sm mt-2">Search for products, articles, and more</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
