"use client";

import { ProductCard } from "@/app/components/ui/ProductCard";

const relatedProducts = [
  {
    id: 2,
    name: "Golden Amber",
    category: "Eau de Parfum",
    price: "$210",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Eclat d'Or",
    category: "Eau de Toilette",
    price: "$140",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Noir Intense",
    category: "Parfum",
    price: "$250",
    image: "https://images.unsplash.com/photo-1523293188086-b431e96000ec?q=80&w=1000&auto=format&fit=crop",
  },
];

export function RelatedProducts() {
  return (
    <section className="py-24">
       <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl text-white">You May Also Like</h2>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image}
                    delay={index * 0.1}
                />
            ))}
       </div>
    </section>
  );
}
