"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductCard } from "@/app/components/ui/ProductCard";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { PageHero } from "@/app/components/ui/PageHero";

const products = [
  { id: 1, name: "Midnight Bloom", category: "Eau de Parfum", price: 180, image: "https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "Golden Amber", category: "Eau de Parfum", price: 210, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Velvet Rose", category: "Eau de Parfum", price: 195, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "Noir Intense", category: "Parfum", price: 250, image: "https://images.unsplash.com/photo-1523293188086-b431e96000ec?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, name: "Eclat d'Or", category: "Eau de Toilette", price: 140, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1000&auto=format&fit=crop" },
  { id: 6, name: "Mystique", category: "Eau de Parfum", price: 200, image: "https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=2670&auto=format&fit=crop" },
];

export default function Collection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");

  const categories = ["All", "Eau de Parfum", "Parfum", "Eau de Toilette"];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.price - b.price;
      if (sortOption === "Price: High to Low") return b.price - a.price;
      return 0; // Featured order
    });

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <PageHero 
        title="The Collection" 
        subtitle="Discover Your Scent"
        image="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop"
      />
      
      <div className="pt-12 text-center">
        <p className="text-gray-400 font-light max-w-xl mx-auto px-6 mb-12">
          Explore our exclusive range of fragrances, each crafted to tell a unique story.
        </p>

        {/* Controls */}
        <div className="container mx-auto px-6 max-w-4xl space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
                <input 
                    type="text" 
                    placeholder="Search fragrances..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-sm focus:border-gold focus:outline-none rounded-full transition-colors text-white placeholder:text-gray-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-b border-white/5 py-4">
                {/* Category Filter */}
                <div className="flex gap-2 text-sm overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full border transition-all ${selectedCategory === cat ? "border-gold text-gold bg-gold/10" : "border-transparent text-gray-400 hover:text-white"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="relative group">
                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                        Sort by: <span className="text-gold">{sortOption}</span> <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-midnight border border-white/10 rounded-sm shadow-xl p-2 hidden group-hover:block z-20">
                         {["Featured", "Price: Low to High", "Price: High to Low"].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setSortOption(opt)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${sortOption === opt ? "text-gold" : "text-gray-400"}`}
                            >
                                {opt}
                            </button>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    category={product.category}
                    price={`$${product.price}`}
                    image={product.image}
                    delay={index * 0.05}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-24 text-gray-500">
                <p>No fragrances found.</p>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
