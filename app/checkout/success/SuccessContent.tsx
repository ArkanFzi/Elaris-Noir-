"use client";

import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export function SuccessContent() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 text-gold animate-bounce">
        <CheckCircle className="w-20 h-20" />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Order Confirmed</h1>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Thank you for your purchase. We have received your order and are preparing it with care. You will receive a confirmation email shortly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
            <Button variant="gold" size="lg">Return to Home</Button>
        </Link>
        <Link href="/account">
            <Button variant="outline" size="lg">View Order</Button>
        </Link>
      </div>
    </div>
  );
}
