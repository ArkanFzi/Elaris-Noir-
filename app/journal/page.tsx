import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/app/components/ui/PageHero";

const articles = [
  {
    id: 1,
    title: "The Art of Layering Scents",
    excerpt: "Discover how to combine different fragrances to create a signature scent that is uniquely yours.",
    date: "December 12, 2024",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
    category: "Tips & Tricks"
  },
  {
     id: 2,
    title: "Sourcing Oud: A Journey to the East",
    excerpt: "We travel to the dense forests of Southeast Asia to find the rarest and most potent oud for our Noir collection.",
    date: "November 28, 2024",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2670&auto=format&fit=crop",
    category: "Behind the Scenes"
  },
  {
    id: 3,
    title: "Why Scent is the Strongest Memory",
    excerpt: "Exploring the science behind olfactory memory and why a simple whiff can take you back in time.",
    date: "November 10, 2024",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    category: "Culture"
  }
];

export default function Journal() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.map((article) => (
                <div key={article.id} className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden mb-6 bg-white/5 relative">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute top-4 left-4 bg-midnight/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backend-blur-md">
                            {article.category}
                        </div>
                    </div>
                    <div className="flex justify-between items-start mb-2 text-gray-400 text-xs">
                        <span>{article.date}</span>
                    </div>
                    <h2 className="font-serif text-2xl text-white mb-3 group-hover:text-gold transition-colors leading-tight">
                        {article.title}
                    </h2>
                    <p className="text-gray-400 font-light text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                    </p>
                    <Link href="#" className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-white transition-colors gap-1">
                        Read Article <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
            ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
