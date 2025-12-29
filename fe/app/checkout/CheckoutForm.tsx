"use client";

import { Button } from "@/app/components/ui/Button";
import { useCart, CartItem } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CheckoutForm() {
  const { cartCount, closeCart, cartItems } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    line1: "",
    city: "",
    postal_code: "",
    country: "",
  });

  // Close cart drawer if open when landing here
  useEffect(() => {
    if (closeCart) closeCart();
  }, [closeCart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { full_name, line1, city, postal_code, country } = formData;
    if (!full_name || !line1 || !city || !postal_code || !country) {
      setErrorMessage("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsProcessing(true);

    const orderData = {
      items: cartItems.map((item: CartItem) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      shipping_address: formData,
      total_cents: cartItems.reduce(
        (total: number, item: CartItem) =>
          total + item.price_cents * item.quantity,
        0
      ),
    };

    try {
      if (!token) {
        throw new Error("You must be logged in to create an order");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const result = await response.json();
      console.log("Order created successfully", result);
      router.push("/checkout/success"); // Redirect to success page
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("Error creating order", error);
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        {/* Shipping Form */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-white">
              Contact Information
            </h2>
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-white">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
              />
            </div>
            <input
              type="text"
              name="line1"
              placeholder="Address Line 1"
              value={formData.line1}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-white">Payment</h2>
            <div className="p-4 border border-white/10 rounded-sm bg-white/5 text-center text-sm text-gray-400">
              Payment Gateway Integration Coming Soon.
              <br />
              <span className="text-gold">
                Proceeding will simulate a successful transaction.
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Complete Order"}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 p-8 rounded-sm h-fit">
          <h2 className="font-serif text-xl text-white mb-6">Order Summary</h2>

          {cartCount === 0 ? (
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-midnight border border-white/10 rounded-sm overflow-hidden relative">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      crossOrigin="anonymous"
                      layout="fill"
                      objectFit="cover"
                    />
                    <span className="absolute top-0 right-0 bg-gold text-midnight text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-white">
                    ${(item.price_cents / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>
                $
                {cartItems.reduce(
                  (total: number, item: CartItem) => total + item.price_cents,
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between text-white font-medium text-lg pt-4 border-t border-white/10 mt-4">
              <span>Total</span>
              <span className="text-gold">
                $
                {cartItems.reduce(
                  (total: number, item: CartItem) => total + item.price_cents,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
