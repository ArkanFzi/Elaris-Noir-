"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Search, Trash2, Package } from "lucide-react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/app/lib/api";

type OrderItem = {
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  name: string;
  image_url: string;
};

type Order = {
  id: number;
  user_id: number;
  user_email: string;
  first_name: string;
  last_name: string;
  total_cents: number;
  status: string;
  items: OrderItem[];
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "processing", label: "Processing", color: "bg-blue-500/20 text-blue-400" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500/20 text-purple-400" },
  { value: "delivered", label: "Delivered", color: "bg-green-500/20 text-green-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/20 text-red-400" },
];

export default function OrdersManagement() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: { status?: string; search?: string } = {};
        if (statusFilter) filters.status = statusFilter;
        if (searchQuery) filters.search = searchQuery;
        
        const data = await getAllOrders(token, filters);
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (!token) return;
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id, token);
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || "bg-gray-500/20 text-gray-400";
  };

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
            Orders Management
          </h1>
          <p className="text-gray-400">View and manage customer orders</p>
        </div>
        <div className="bg-gold/10 px-4 py-2 rounded-lg border border-gold/20 text-gold text-sm font-medium">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-midnight-light border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-midnight-light border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading orders...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-midnight-light border-white/10 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Customer: {order.first_name} {order.last_name} ({order.user_email})</p>
                      <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-gold font-medium">Total: ${(order.total_cents / 100).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-gold focus:outline-none"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-gold font-medium">${(item.unit_price_cents / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
