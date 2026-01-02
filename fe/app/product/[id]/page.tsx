import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductActions } from "@/app/components/product/ProductActions";
import { ReviewsSection } from "@/app/components/product/ReviewsSection";
import { RelatedProducts } from "@/app/components/product/RelatedProducts";
import { getProduct } from "@/app/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product;
  try {
    product = await getProduct(parseInt(id));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  const formattedPrice = `$${(product.price_cents / 100).toFixed(2)}`;

  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <div className="pt-32 pb-12 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image Side - Sticky */}
          <div className="md:sticky md:top-32 aspect-[4/5] bg-white/5 overflow-hidden relative">
             <Image 
               src={product.image_url} 
               alt={product.name}
               fill
               priority
               className="object-cover"
             />
          </div>

          {/* Details Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div>
                 <p className="text-gold uppercase tracking-widest text-sm mb-2">{product.category}</p>
                 <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">{product.name}</h1>
                 <p className="text-2xl text-gold font-light">{formattedPrice}</p>
              </div>

              <p className="text-gray-400 leading-relaxed font-light text-lg">
                {product.description || "No description available for this exquisite fragrance."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <ProductActions product={{
                   id: product.id,
                   name: product.name,
                   price: formattedPrice,
                   image: product.image_url,
                   category: product.category
                 }} />
              </div>
            </div>

            {/* Visual Notes Pyramid (Dynamic if fields exist, otherwise fallback) */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="font-serif text-xl text-white mb-6">Olfactory Pyramid</h3>
              <div className="bg-white/5 p-8 rounded-sm space-y-6 text-center">
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Top Notes</span>
                      <p className="text-mist font-light">{product.top_notes || "Bergamot, Black Pepper"}</p>
                  </div>
                  <div className="w-2/3 mx-auto border-t border-white/5 my-2"></div>
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Heart Notes</span>
                      <p className="text-mist font-light">{product.heart_notes || "Night-Blooming Jasmine, Rose Absolute"}</p>
                  </div>
                   <div className="w-2/3 mx-auto border-t border-white/5 my-2"></div>
                  <div>
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Base Notes</span>
                      <p className="text-mist font-light">{product.base_notes || "Dark Amber, Oud, Vanilla Bean"}</p>
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
         <RelatedProducts currentProductId={id} />
      </div>

      <Footer />
    </main>
  );
}
