"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { createTestimonial, updateTestimonial } from "@/app/lib/api";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  testimonial?: {
    id: number;
    author_name: string;
    author_title: string;
    author_image: string;
    text: string;
    rating: number;
    status: string;
  };
}

export function TestimonialModal({
  isOpen,
  onClose,
  onSuccess,
  token,
  testimonial,
}: TestimonialModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    author_name: "",
    author_title: "",
    author_image: "",
    text: "",
    rating: 5,
    status: "draft",
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        author_name: testimonial.author_name,
        author_title: testimonial.author_title,
        author_image: testimonial.author_image,
        text: testimonial.text,
        rating: testimonial.rating,
        status: testimonial.status,
      });
    } else {
      setFormData({
        author_name: "",
        author_title: "",
        author_image: "",
        text: "",
        rating: 5,
        status: "draft",
      });
    }
    setError(null);
  }, [testimonial, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "rating") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.author_name.trim() || !formData.text.trim()) {
        setError("Name and testimonial text are required");
        setLoading(false);
        return;
      }

      if (formData.rating < 1 || formData.rating > 5) {
        setError("Rating must be between 1 and 5");
        setLoading(false);
        return;
      }

      if (testimonial) {
        await updateTestimonial(testimonial.id, formData, token);
      } else {
        await createTestimonial(formData, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save testimonial"
      );
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
            {testimonial ? "Edit Testimonial" : "New Testimonial"}
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

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Author Name *
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              placeholder="Customer name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Author Title & Rating Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Title/Position
              </label>
              <input
                type="text"
                name="author_title"
                value={formData.author_title}
                onChange={handleChange}
                placeholder="e.g., Skincare Enthusiast"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rating *
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold focus:outline-none transition-colors"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
          </div>

          {/* Author Image URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Author Image URL
            </label>
            <input
              type="url"
              name="author_image"
              value={formData.author_image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold focus:outline-none transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Testimonial Text */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Testimonial *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="What did the customer say?"
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
                : testimonial
                ? "Update Testimonial"
                : "Create Testimonial"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
