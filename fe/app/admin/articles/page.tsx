"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import Image from "next/image";
import { getArticles, deleteArticle } from "@/app/lib/api";
import { ArticleModal } from "@/app/components/admin/ArticleModal";

export default function ArticlesManagement() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles();
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Are you sure?")) return;
    try {
      await deleteArticle(id, token);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    }
  };

  const handleOpenModal = (article?: any) => {
    setSelectedArticle(article || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchArticles();
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Articles Management
          </h1>
          <p className="text-gray-400">Manage your journal content</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-midnight-light border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading articles...</p>
        </div>
      ) : (
        <>
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-midnight-light border-white/10 overflow-hidden"
              >
                <div className="aspect-4/3 relative overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-400/20 text-green-400"
                          : "bg-yellow-400/20 text-yellow-400"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gold uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`/journal/${article.id}`, "_blank")}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal(article)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No articles found.</p>
            </div>
          )}
        </>
      )}

      {token && (
        <ArticleModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          token={token}
          article={selectedArticle}
        />
      )}
    </div>
  );
}
