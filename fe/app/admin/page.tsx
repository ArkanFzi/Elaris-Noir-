"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import {
  Users,
  Package,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Activity,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

// Mock data - in production this would come from API
const initialStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalArticles: 0,
  totalTestimonials: 0,
  monthlyRevenue: 0,
  growthRate: 0,
};

const recentActivity = [
  {
    id: 1,
    type: "user",
    message: "New user registered: Sarah Johnson",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "product",
    message: "Product 'Golden Amber' updated",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "article",
    message: "New article published: 'Scent Layering Guide'",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "testimonial",
    message: "New testimonial added",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "user",
    message: "User order completed: Order #1234",
    time: "3 hours ago",
  },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-blue-900/5",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-emerald-900/5",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-gold",
      gradient: "from-amber-500/20 to-amber-900/5",
      borderColor: "border-gold/20",
    },
    {
      title: "Growth Rate",
      value: `+${stats.growthRate}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-purple-900/5",
      borderColor: "border-purple-500/20",
    },
     {
      title: "Articles",
      value: stats.totalArticles.toString(),
      icon: FileText,
      color: "text-pink-400",
      gradient: "from-pink-500/20 to-pink-900/5",
      borderColor: "border-pink-500/20",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials.toString(),
      icon: MessageSquare,
      color: "text-cyan-400",
      gradient: "from-cyan-500/20 to-cyan-900/5",
      borderColor: "border-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white mb-2 tracking-wide">
            Dashboard Overview
          </h1>
          <p className="text-gray-400">
            Real-time insights and performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gold bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
          <Activity className="w-4 h-4" />
          <span>System Status: Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={`bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-black/20`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Information */}
        <div className="lg:col-span-2">
           <Card className="bg-midnight-light/50 border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white font-serif">Recent Activity</CardTitle>
              <Link href="/admin/activity" className="text-xs text-gold hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex items-start gap-4 pb-4 border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/5 p-3 rounded-lg -mx-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        activity.type === "user"
                          ? "bg-blue-500/20 text-blue-400"
                          : activity.type === "product"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : activity.type === "article"
                          ? "bg-pink-500/20 text-pink-400"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                        {activity.type === "user" && <Users className="w-5 h-5" />}
                        {activity.type === "product" && <Package className="w-5 h-5" />}
                        {activity.type === "article" && <FileText className="w-5 h-5" />}
                        {activity.type === "testimonial" && <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200 font-medium group-hover:text-gold transition-colors">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
           <Card className="bg-midnight-light/50 border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/admin/products/new" className="block w-full">
                   <button className="w-full p-4 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 hover:border-gold/50 rounded-lg transition-all group flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold text-white group-hover:text-gold transition-colors">Add Product</span>
                            <span className="block text-xs text-gray-400">New fragrance</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold/50 group-hover:translate-x-1 transition-transform" />
                   </button>
                </Link>
                
                <Link href="/admin/articles/new" className="block w-full">
                    <button className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 rounded-lg transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Write Article</span>
                                <span className="block text-xs text-gray-400">Publish content</span>
                            </div>
                        </div>
                         <ArrowRight className="w-4 h-4 text-purple-400/50 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>

                 <Link href="/admin/users" className="block w-full">
                    <button className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 rounded-lg transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Manage Users</span>
                                <span className="block text-xs text-gray-400">View customer base</span>
                            </div>
                        </div>
                         <ArrowRight className="w-4 h-4 text-blue-400/50 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
