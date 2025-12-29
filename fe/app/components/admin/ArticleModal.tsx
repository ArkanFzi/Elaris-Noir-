"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { createArticle, updateArticle } from "@/app/lib/api";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  article?: {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    status: string;
  };
}

const CATEGORIES = [
  "Skincare",
  "Ingredients",
  "Wellness",
  "Beauty Tips",
  "Science",
  "Stories",
];

export function ArticleModal({
  isOpen,
  onClose,
  onSuccess,
  token,
  article,
}: ArticleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    image_url: "",
    status: "draft",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        image_url: article.image_url,
        status: article.status,
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: CATEGORIES[0],
        image_url: "",
        status: "draft",
      });
    }
    setError(null);
  }, [article, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (
        !formData.title.trim() ||
        !formData.excerpt.trim() ||
        !formData.content.trim()
      ) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (article) {
        await updateArticle(article.id, formData, token);
      } else {
        await createArticle(formData, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
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
            {article ? "Edit Article" : "New Article"}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Article title"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Category & Status Row */}
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
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the article..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Full article content..."
              rows={8}
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
                : article
                ? "Update Article"
                : "Create Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
