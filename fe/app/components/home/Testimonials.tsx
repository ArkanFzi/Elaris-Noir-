import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "Elaris Noir has completely redefined my expectation of luxury fragrance. The scent profile is complex, evolving beautifully throughout the day.",
    author: "Isabella R.",
    source: "Verified Buyer",
    rating: 5
  },
  {
    id: 2,
    text: "A masterpiece of olfactory art. 'Midnight Bloom' captures the essence of a Parisian evening perfectly. I'm constantly asked what I'm wearing.",
    author: "James T.",
    source: "Verified Buyer",
    rating: 5
  },
  {
    id: 3,
    text: "The packaging alone is an experience. Heavy glass, gold details—it sits on my vanity like a jewel. The fragrance inside is equally stunning.",
    author: "Sophie L.",
    source: "Verified Buyer",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-midnight relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 border rounded-full border-gold/30 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 border rounded-full border-gold/20 translate-x-1/3 translate-y-1/3" />
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Adored by Connoisseurs</h2>
            <div className="h-0.5 w-12 bg-gold mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white/5 p-8 border border-white/10 hover:border-gold/30 transition-colors duration-300 relative group">
              <div className="absolute -top-3 left-8 text-gold text-4xl font-serif opacity-30">&quot;</div>
              <div className="flex gap-1 text-gold mb-6 text-xs">
                {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 font-light italic mb-6 leading-relaxed">
                {t.text}
              </p>
              <div>
                <p className="text-white font-medium font-serif">{t.author}</p>
                <p className="text-gold/60 text-xs uppercase tracking-wider">{t.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
