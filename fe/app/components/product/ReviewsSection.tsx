"use client";

import { Star } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

const reviews = [
  {
    id: 1,
    author: "Sarah J.",
    rating: 5,
    date: "2 days ago",
    title: "Absolutely mesmerizing",
    content: "The scent is deep and lasts all day. I get so many compliments when I wear this. It's truly a midnight bloom!",
  },
  {
    id: 2,
    author: "Michael T.",
    rating: 5,
    date: "1 week ago",
    title: "A masterpiece",
    content: "Elaris Noir never disappoints. The packaging is exquisite and the fragrance is sophisticated. Worth every penny.",
  },
  {
    id: 3,
    author: "Emily R.",
    rating: 4,
    date: "2 weeks ago",
    title: "Lovely but intense",
    content: "A very strong scent, perfect for evening wear. Might be too much for the office, but perfect for a date night.",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 border-t border-white/5">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Summary side */}
        <div className="md:w-1/3 space-y-6">
          <h2 className="font-serif text-3xl text-white">Reviews</h2>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-serif text-gold">4.8</span>
            <div className="space-y-1">
                <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                </div>
                <p className="text-sm text-gray-400">Based on 128 reviews</p>
            </div>
          </div>
          <Button variant="outline" className="w-full md:w-auto">Write a Review</Button>
        </div>

        {/* Reviews List */}
        <div className="md:w-2/3 space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 p-6 rounded-sm border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex text-gold mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-600"}`} 
                                    />
                                ))}
                            </div>
                            <h4 className="font-serif text-lg text-white">{review.title}</h4>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{review.content}</p>
                    <p className="text-xs text-gold uppercase tracking-widest">{review.author}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
