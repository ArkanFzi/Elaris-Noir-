"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/app/components/ui/PageHero";
import { getArticles } from "@/app/lib/api";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
};

export default function Journal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles("published");
        setArticles(data || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <PageHero 
        title="The Journal" 
        subtitle="Notes & Inspirations"
        image="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2670&auto=format&fit=crop"
      />

      <div className="pt-16 pb-12 text-center container mx-auto px-6">
        <p className="text-gray-400 font-light max-w-xl mx-auto">
            Stories, inspirations, and notes from the world of perfumery.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-white/5 relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-midnight/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur-md">
                    {article.category}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2 text-gray-400 text-xs">
                  <span>
                    {article.published_at 
                      ? new Date(article.published_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Recently'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-white mb-3 group-hover:text-gold transition-colors leading-tight">
                  {article.title}
                </h2>
                <p className="text-gray-400 font-light text-sm line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <Link href={`/journal/${article.id}`} className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-white transition-colors gap-1">
                  Read Article <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
