"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/ui/Button";
import { MapPin, Mail, Phone } from "lucide-react";
import { PageHero } from "@/app/components/ui/PageHero";

export default function Contact() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <PageHero 
        title="Contact Us" 
        subtitle="Get in Touch"
        image="https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=2606&auto=format&fit=crop"
      />
      
      <div className="pt-16 pb-24 container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
                <div>
                    <h3 className="font-serif text-2xl text-gold mb-4">Get in Touch</h3>
                    <p className="text-gray-400 font-light leading-relaxed">
                        We are here to assist you with any inquiries regarding our products, orders, or brand. Please feel free to reach out to us.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <MapPin className="text-gold w-6 h-6 mt-1" />
                        <div>
                            <h4 className="text-white font-medium">Boutique</h4>
                            <p className="text-gray-400 font-light">
                                Jalan Elaris Noir No. 88<br />
                                Jakarta Selatan, Indonesia 12345
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Mail className="text-gold w-6 h-6 mt-1" />
                        <div>
                            <h4 className="text-white font-medium">Email</h4>
                            <p className="text-gray-400 font-light">info@elarisnoir.com</p>
                            <p className="text-gray-400 font-light">press@elarisnoir.com</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="text-gold w-6 h-6 mt-1" />
                        <div>
                            <h4 className="text-white font-medium">Phone</h4>
                            <p className="text-gray-400 font-light">+62 21 555 0123</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white/5 p-8 rounded-sm">
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gold mb-2">Name</label>
                            <input type="text" className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gold mb-2">Email</label>
                            <input type="email" className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2">Subject</label>
                         <input type="text" className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2">Message</label>
                        <textarea rows={5} className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"></textarea>
                    </div>
                    <Button type="submit" size="lg" className="w-full">Send Message</Button>
                </form>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
