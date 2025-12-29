"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import {
  getTestimonials,
  deleteTestimonial,
  updateTestimonial,
} from "@/app/lib/api";
import { TestimonialModal } from "@/app/components/admin/TestimonialModal";

export default function TestimonialsManagement() {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch testimonials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Are you sure?")) return;
    try {
      await deleteTestimonial(id, token);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete testimonial"
      );
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    if (!token) return;
    try {
      const testimonial = testimonials.find((t) => t.id === id);
      if (!testimonial) return;
      await updateTestimonial(id, { ...testimonial, status }, token);
      setTestimonials(
        testimonials.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update testimonial"
      );
    }
  };

  const handleOpenModal = (testimonial?: any) => {
    setSelectedTestimonial(testimonial || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTestimonial(null);
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchTestimonials();
  };

  const publishedCount = testimonials.filter(
    (t) => t.status === "published"
  ).length;
  const draftCount = testimonials.filter((t) => t.status === "draft").length;

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">
            Testimonials Management
          </h1>
          <p className="text-gray-400">
            Manage customer reviews and testimonials
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-midnight-light border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-400/10 rounded-lg">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {publishedCount}
                </p>
                <p className="text-sm text-gray-400">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-light border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-400/10 rounded-lg">
                <EyeOff className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{draftCount}</p>
                <p className="text-sm text-gray-400">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-light border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(
                    testimonials.reduce((acc, t) => acc + t.rating, 0) /
                    testimonials.length
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials List */}
      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="bg-midnight-light border-white/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-midnight font-bold">
                    {testimonial.author_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white">
                      {testimonial.author_name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {testimonial.author_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      testimonial.status === "published"
                        ? "bg-green-400/20 text-green-400"
                        : "bg-yellow-400/20 text-yellow-400"
                    }`}
                  >
                    {testimonial.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <blockquote className="text-gray-300 italic mb-6 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </blockquote>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(testimonial)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleStatusChange(
                      testimonial.id,
                      testimonial.status === "published" ? "draft" : "published"
                    )
                  }
                >
                  {testimonial.status === "published" ? (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No testimonials found.</p>
        </div>
      )}

      {token && (
        <TestimonialModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          token={token}
          testimonial={selectedTestimonial}
        />
      )}
    </div>
  );
}
