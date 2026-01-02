"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getArticles } from "@/app/lib/api";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
};

export function JournalPreview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles("published");
        setArticles(data ? data.slice(0, 3) : []);
      } catch (error) {
        console.error("Failed to fetch journal preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-midnight text-mist border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">The Journal</h2>
                <p className="text-gray-400 font-light hidden md:block">Notes, inspirations, and stories from our atelier.</p>
            </div>
            <Link href="/journal" className="text-gold hover:text-white transition-colors uppercase tracking-widest text-sm border-b border-gold pb-1">
                View All Stories
            </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading stories...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article) => (
                  <div key={article.id} className="group cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden mb-6 bg-white/5 relative">
                          <Image 
                              src={article.image_url} 
                              alt={article.title} 
                              fill
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                          />
                          <div className="absolute top-4 left-4 bg-midnight/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold text-shadow-sm backdrop-blur-md z-10">
                              {article.category}
                          </div>
                      </div>
                      <div className="flex justify-between items-start mb-2 text-gray-400 text-xs">
                          <span>
                            {article.published_at 
                              ? new Date(article.published_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                }) 
                              : 'Recently'}
                          </span>
                      </div>
                      <h3 className="font-serif text-xl text-white mb-2 group-hover:text-gold transition-colors leading-tight">
                          {article.title}
                      </h3>
                      <p className="text-gray-400 font-light text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                      </p>
                      <Link href={`/journal/${article.id}`} className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-white transition-colors gap-1">
                          Read Article <ArrowUpRight className="w-3 h-3" />
                      </Link>
                  </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-20 font-light text-gray-400">
            Check back soon for new stories.
          </div>
        )}
      </div>
    </section>
  );
}
