"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/app/components/ui/Card";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { getOrders } from "@/app/lib/api";

type OrderItem = {
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  name: string;
  image_url: string;
};

type Order = {
  id: number;
  total_cents: number;
  status: string;
  items: OrderItem[];
  created_at: string;
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Pending" },
  processing: { icon: Package, color: "text-blue-400", bg: "bg-blue-500/10", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-400", bg: "bg-purple-500/10", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Cancelled" },
};

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders(token!);
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  };

  return (
    <div className="min-h-screen bg-midnight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Order History</h1>
          <p className="text-gray-400">Track and view your past orders</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg mb-6 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="bg-midnight-light border-white/10 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">No Orders Yet</h3>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <a
              href="/collection"
              className="inline-block px-6 py-3 bg-gold text-midnight font-bold rounded-lg hover:bg-white transition-colors"
            >
              Browse Products
            </a>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} className="bg-midnight-light border-white/10 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Order #{order.id}</h3>
                        <p className="text-sm text-gray-400">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-black/20 p-3 rounded-lg">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-gold font-bold">
                            ${(item.unit_price_cents / 100).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-gray-400 font-medium">Total Amount</span>
                      <span className="text-2xl font-bold text-gold">
                        ${(order.total_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
