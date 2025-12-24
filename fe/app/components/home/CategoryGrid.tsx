import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Pour Elle",
    subtitle: "Feminine Elegance",
    image: "https://images.unsplash.com/photo-1590540179852-2110a54f813a?q=80&w=2000&auto=format&fit=crop",
    link: "/collection?category=femme"
  },
  {
    id: 2,
    title: "Pour Homme",
    subtitle: "Masculine Depth",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2670&auto=format&fit=crop",
    link: "/collection?category=homme"
  },
  {
    id: 3,
    title: "Signatures",
    subtitle: "The Noir Collection",
    image: "https://images.unsplash.com/photo-1512777576255-b8d9d2355a93?q=80&w=2674&auto=format&fit=crop",
    link: "/collection?category=signature"
  }
];

export function CategoryGrid() {
  return (
    <section className="py-24 bg-midnight text-mist">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {categories.map((category) => (
            <Link 
              href={category.link} 
              key={category.id} 
              className="group relative overflow-hidden h-[400px] md:h-full block"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gray-900">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
              </div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                 <p className="text-gold uppercase tracking-widest text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                   {category.subtitle}
                 </p>
                 <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                   {category.title}
                 </h3>
                 <span className="inline-flex items-center text-sm uppercase tracking-widest border-b border-transparent group-hover:border-gold pb-1 transition-all duration-300">
                   Explore <ArrowRight className="ml-2 w-4 h-4" />
                 </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
