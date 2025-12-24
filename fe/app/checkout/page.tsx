import Link from "next/link";
import { CheckoutForm } from "./CheckoutForm";

export default function Checkout() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <div className="bg-midnight-light border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold tracking-widest text-gold">
              ELARIS NOIR
            </Link>
            <span className="text-sm text-gray-400">Secure Checkout</span>
        </div>
      </div>

      <CheckoutForm />
    </main>
  );
}
