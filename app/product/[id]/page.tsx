import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductActions } from "@/app/components/product/ProductActions";
import { ReviewsSection } from "@/app/components/product/ReviewsSection";
import { RelatedProducts } from "@/app/components/product/RelatedProducts";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = {
    name: "Midnight Bloom",
    price: "$180",
    description: "An intoxicating blend of night-blooming jasmine, dark amber, and rare woods. Designed for those who embrace the mystery of the evening.",
    image: "https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop"
  };

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <div className="pt-32 pb-12 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image Side - Sticky */}
          <div className="md:sticky md:top-32 aspect-[4/5] bg-white/5 overflow-hidden">
             <img 
               src={product.image} 
               alt={product.name}
               className="w-full h-full object-cover"
             />
          </div>

          {/* Details Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div>
                 <p className="text-gold uppercase tracking-widest text-sm mb-2">Eau de Parfum</p>
                 <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">{product.name}</h1>
                 <p className="text-2xl text-gold font-light">{product.price}</p>
              </div>

              <p className="text-gray-400 leading-relaxed font-light text-lg">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <ProductActions product={{...product, id: id}} />
              </div>
            </div>

            {/* Visual Notes Pyramid */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="font-serif text-xl text-white mb-6">Olfactory Pyramid</h3>
              <div className="bg-white/5 p-8 rounded-sm space-y-6 text-center">
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Top Notes</span>
                      <p className="text-mist font-light">Bergamot, Black Pepper</p>
                  </div>
                  <div className="w-2/3 mx-auto border-t border-white/5 my-2"></div>
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Heart Notes</span>
                      <p className="text-mist font-light">Night-Blooming Jasmine, Rose Absolute</p>
                  </div>
                   <div className="w-2/3 mx-auto border-t border-white/5 my-2"></div>
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Base Notes</span>
                      <p className="text-mist font-light">Dark Amber, Oud, Vanilla Bean</p>
                  </div>
              </div>
            </div>

            {/* Accordion / Additional Info (Static for now) */}
            <div className="space-y-4 pt-4">
                <details className="group border-b border-white/10 pb-4 cursor-pointer">
                    <summary className="flex justify-between items-center font-serif text-lg text-gray-300 group-hover:text-gold transition-colors">
                        Ingredients
                        <span className="text-gold">+</span>
                    </summary>
                    <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed">
                        Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Limonene, Coumarin, Citronellol, Geraniol.
                    </p>
                </details>
                <details className="group border-b border-white/10 pb-4 cursor-pointer">
                     <summary className="flex justify-between items-center font-serif text-lg text-gray-300 group-hover:text-gold transition-colors">
                        Shipping & Returns
                        <span className="text-gold">+</span>
                    </summary>
                     <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed">
                        Complimentary shipping on all orders. Returns are accepted within 30 days of purchase.
                    </p>
                </details>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
         <ReviewsSection />
         <RelatedProducts />
      </div>

      <Footer />
    </main>
  );
}
