import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-midnight py-16 border-t border-white/5 text-mist">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-gold block">
              ELARIS NOIR
            </Link>
            <p className="text-sm font-light leading-relaxed text-gray-400">
              Crafting timeless scents for the modern soul. Experience the essence of luxury in every drop.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gold transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/collection" className="hover:text-gold transition-colors">All Perfumes</Link></li>
              <li><Link href="/collection" className="hover:text-gold transition-colors">Bestsellers</Link></li>
              <li><Link href="/collection" className="hover:text-gold transition-colors">Gift Sets</Link></li>
              <li><Link href="/collection" className="hover:text-gold transition-colors">Discovery Kits</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-6">About</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/our-story" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link href="/our-story" className="hover:text-gold transition-colors">Sustainability</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Store Locator</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-6">Newsletter</h4>
            <p className="text-sm font-light text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent border border-white/20 p-3 text-sm focus:border-gold focus:outline-none transition-colors"
              />
              <button className="bg-gold text-midnight text-sm font-bold uppercase tracking-widest py-3 hover:bg-gold-light transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500">
          <p>&copy; {new Date().getFullYear()} Elaris Noir. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
