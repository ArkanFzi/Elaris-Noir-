"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { PageHero } from "@/app/components/ui/PageHero";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import { getArticle } from "@/app/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

type Article = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
};

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const data = await getArticle(parseInt(id));
        setArticle(data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError("Article not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-gold animate-pulse font-serif text-xl tracking-widest">
            Loading...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-midnight text-mist">
        <Navbar />
        <div className="container mx-auto px-6 py-32 text-center">
          <h2 className="text-3xl font-serif text-white mb-6">{error || "Article not found"}</h2>
          <Button onClick={() => router.push("/journal")} variant="outline">
            Back to Journal
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <PageHero 
        title={article.title} 
        subtitle={article.category}
        image={article.image_url}
        overlayOpacity={70}
      />

      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Metadata & Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-white/10">
            <Link 
              href="/journal" 
              className="group flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Journal
            </Link>

            <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                {new Date(article.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold" />
                {article.category}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert prose-gold max-w-none"
          >
            <div className="text-gray-300 leading-relaxed space-y-6 text-lg font-light">
              {article.content.split("\n").map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))}
            </div>
          </motion.article>

          {/* Author/Footer */}
          <div className="mt-20 p-8 bg-white/5 border border-white/10 rounded-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold">
               <User className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-serif text-white text-lg">Elaris Noir Editorial</h4>
              <p className="text-gray-400 text-sm mt-1">
                Explore more about the art of perfumery and our latest collection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
