"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { createProduct, updateProduct } from "@/app/lib/api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  product?: {
    id: number;
    name: string;
    category: string;
    description: string;
    price_cents: number;
    image_url: string;
  };
}

const CATEGORIES = [
  "Skincare",
  "Serums",
  "Masks",
  "Cleansers",
  "Moisturizers",
  "Sets",
];

export function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  token,
  product,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    description: "",
    price_cents: 0,
    image_url: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price_cents: product.price_cents,
        image_url: product.image_url,
      });
    } else {
      setFormData({
        name: "",
        category: CATEGORIES[0],
        description: "",
        price_cents: 0,
        image_url: "",
      });
    }
    setError(null);
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price_cents") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.description.trim()) {
        setError("Name and description are required");
        setLoading(false);
        return;
      }

      if (formData.price_cents < 0) {
        setError("Price cannot be negative");
        setLoading(false);
        return;
      }

      if (product) {
        await updateProduct(product.id, formData, token);
      } else {
        await createProduct(formData, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-midnight-light border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-midnight-light border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif text-white">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Luminous Day Serum"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold focus:outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Price (cents) *
              </label>
              <input
                type="number"
                name="price_cents"
                value={formData.price_cents}
                onChange={handleChange}
                placeholder="e.g., 5999 for $59.99"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                ${(formData.price_cents / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description with ingredients and benefits..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
