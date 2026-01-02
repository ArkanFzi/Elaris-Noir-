"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductCard } from "@/app/components/ui/ProductCard";
import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { PageHero } from "@/app/components/ui/PageHero";
import { getProducts } from "@/app/lib/api";

type Product = {
  id: number;
  name: string;
  category: string;
  price_cents: number;
  image_url: string;
};

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["All", "Eau de Parfum", "Parfum", "Eau de Toilette"];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.price_cents - b.price_cents;
      if (sortOption === "Price: High to Low") return b.price_cents - a.price_cents;
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    category={product.category}
                    price={`$${(product.price_cents / 100).toFixed(2)}`}
                    image={product.image_url}
                    delay={index * 0.1}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <p className="text-gray-400">No products found matching your criteria.</p>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
