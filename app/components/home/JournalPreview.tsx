import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// In a real app, this would come from a CMS or API, shared with the main Journal page
const featuredArticles = [
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

export function JournalPreview() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
                <div key={article.id} className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden mb-6 bg-white/5 relative">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute top-4 left-4 bg-midnight/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold text-shadow-sm backdrop-blur-md">
                            {article.category}
                        </div>
                    </div>
                    <div className="flex justify-between items-start mb-2 text-gray-400 text-xs">
                        <span>{article.date}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white mb-2 group-hover:text-gold transition-colors leading-tight">
                        {article.title}
                    </h3>
                    <p className="text-gray-400 font-light text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                    </p>
                    <Link href="/journal" className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-white transition-colors gap-1">
                        Read Article <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
