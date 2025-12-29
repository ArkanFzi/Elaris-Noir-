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
} from "lucide-react";

// Mock data - in production this would come from API
const mockStats = {
  totalUsers: 1247,
  totalProducts: 24,
  totalArticles: 18,
  totalTestimonials: 12,
  monthlyRevenue: 45678,
  growthRate: 12.5,
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
  const [stats] = useState(mockStats);

  // In production, fetch real data from API
  useEffect(() => {
    // fetch('/api/admin/stats').then(res => res.json()).then(setStats);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Articles",
      value: stats.totalArticles.toString(),
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials.toString(),
      icon: MessageSquare,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      title: "Growth Rate",
      value: `+${stats.growthRate}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-midnight-light border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-midnight-light border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-b-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "user"
                        ? "bg-blue-400"
                        : activity.type === "product"
                        ? "bg-green-400"
                        : activity.type === "article"
                        ? "bg-purple-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-light border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gold/10 hover:bg-gold/20 border border-gold/20 hover:border-gold/40 rounded-lg transition-colors text-left">
                <Package className="w-6 h-6 text-gold mb-2" />
                <div className="text-sm font-medium text-white">
                  Add Product
                </div>
                <div className="text-xs text-gray-400">
                  Create new fragrance
                </div>
              </button>
              <button className="p-4 bg-purple-400/10 hover:bg-purple-400/20 border border-purple-400/20 hover:border-purple-400/40 rounded-lg transition-colors text-left">
                <FileText className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-sm font-medium text-white">
                  Write Article
                </div>
                <div className="text-xs text-gray-400">Publish new content</div>
              </button>
              <button className="p-4 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/20 hover:border-blue-400/40 rounded-lg transition-colors text-left">
                <Users className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-sm font-medium text-white">View Users</div>
                <div className="text-xs text-gray-400">Manage customers</div>
              </button>
              <button className="p-4 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/20 hover:border-yellow-400/40 rounded-lg transition-colors text-left">
                <MessageSquare className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="text-sm font-medium text-white">
                  Add Testimonial
                </div>
                <div className="text-xs text-gray-400">
                  Feature customer reviews
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
