"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Image from "next/image";
import { getProducts, deleteProduct } from "@/app/lib/api";
import { ProductModal } from "@/app/components/admin/ProductModal";

export default function ProductsManagement() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Are you sure?")) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleOpenModal = (product?: any) => {
    setSelectedProduct(product || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            Products Management
          </h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4" />
          New Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-midnight-light border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-midnight-light border-white/10 overflow-hidden"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-gray-800">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gold uppercase tracking-widest">
                      {product.category}
                    </span>
                    <span className="text-lg font-bold text-white">
                      ${(product.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOpenModal(product)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No products found.</p>
            </div>
          )}
        </>
      )}

      {token && (
        <ProductModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          token={token}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
