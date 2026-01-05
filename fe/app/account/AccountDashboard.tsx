"use client";

import { Button } from "@/app/components/ui/Button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { apiCall, getOrders, getArticles } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
};

export function AccountDashboard() {
  const { user, token, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab ] = useState<"overview" | "orders" | "addresses" | "profile" | "journals">("overview");
  const [stats, setStats] = useState({ orderCount: 0 });
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (token) {
        try {
          const orders = await getOrders(token);
          setStats({ orderCount: orders ? orders.length : 0 });
        } catch (e) {
          console.error("Failed to fetch account stats", e);
        }
      }
    };
    fetchStats();
  }, [token]);

  useEffect(() => {
    if (activeTab === "journals" && articles.length === 0) {
      const fetchArticles = async () => {
        setArticlesLoading(true);
        try {
          const data = await getArticles("published");
          setArticles(data || []);
        } catch (error) {
          console.error("Failed to fetch articles:", error);
        } finally {
          setArticlesLoading(false);
        }
      };
      fetchArticles();
    }
  }, [activeTab, articles.length]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    try {
      await apiCall("/user/update", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }, token!);
      
      updateUser(profileData);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update profile." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="space-y-1">
                <button 
                    onClick={() => setActiveTab("overview")}
                    className={cn("w-full text-left px-4 py-3 text-sm transition-colors rounded-sm", activeTab === "overview" ? "bg-white/10 text-gold font-medium" : "text-gray-400 hover:text-white")}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={cn("w-full text-left px-4 py-3 text-sm transition-colors rounded-sm", activeTab === "orders" ? "bg-white/10 text-gold font-medium" : "text-gray-400 hover:text-white")}
                >
                    Order History
                </button>
                 <button 
                    onClick={() => setActiveTab("addresses")}
                    className={cn("w-full text-left px-4 py-3 text-sm transition-colors rounded-sm", activeTab === "addresses" ? "bg-white/10 text-gold font-medium" : "text-gray-400 hover:text-white")}
                >
                    Addresses
                </button>
                <button 
                    onClick={() => setActiveTab("profile")}
                    className={cn("w-full text-left px-4 py-3 text-sm transition-colors rounded-sm", activeTab === "profile" ? "bg-white/10 text-gold font-medium" : "text-gray-400 hover:text-white")}
                >
                    Profile Settings
                </button>
                <button 
                    onClick={() => setActiveTab("journals")}
                    className={cn("w-full text-left px-4 py-3 text-sm transition-colors rounded-sm", activeTab === "journals" ? "bg-white/10 text-gold font-medium" : "text-gray-400 hover:text-white")}
                >
                    Journals
                </button>
                <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 rounded-sm transition-colors mt-8"
                >
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 bg-white/5 p-8 rounded-sm min-h-[400px]">
                {activeTab === "overview" && (
                     <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-white">Welcome back, {user?.first_name || "Guest"}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-midnight p-6 border border-white/10 rounded-sm">
                                <h4 className="text-gold text-sm uppercase tracking-widest mb-2">Total Orders</h4>
                                <p className="text-3xl text-white font-serif">{stats.orderCount}</p>
                            </div>
                            <div className="bg-midnight p-6 border border-white/10 rounded-sm">
                                <h4 className="text-gold text-sm uppercase tracking-widest mb-2">Account Type</h4>
                                <p className="text-3xl text-white font-serif capitalize">{user?.role || "Customer"}</p>
                            </div>
                        </div>
                     </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-white">Recent Orders</h2>
                        <div className="text-sm text-gray-400 bg-midnight p-4 rounded-sm border border-white/5">
                            {stats.orderCount > 0 ? (
                              <button onClick={() => router.push("/account/orders")} className="text-gold hover:underline">View all {stats.orderCount} orders</button>
                            ) : (
                              "No recent orders found."
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === "addresses" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                             <h2 className="font-serif text-2xl text-white">Saved Addresses</h2>
                             <Button variant="outline" size="sm">Add New</Button>
                        </div>
                        <div className="text-sm text-gray-400 bg-midnight p-6 rounded-sm border border-white/5">
                            Use addresses to speed up your checkout process.
                        </div>
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-white">Profile Settings</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400">First Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.first_name} 
                                        onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                                        className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold outline-none rounded-sm transition-colors text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.last_name} 
                                        onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                                        className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold outline-none rounded-sm transition-colors text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-400">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profileData.email} 
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full bg-midnight border border-white/10 p-3 text-sm focus:border-gold outline-none rounded-sm transition-colors text-white"
                                />
                            </div>
                            
                            {message && (
                                <p className={cn("text-sm", message.type === "success" ? "text-green-500" : "text-red-500")}>
                                    {message.text}
                                </p>
                            )}

                            <Button disabled={isUpdating} type="submit" className="mt-4">
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </div>
                )}

                {activeTab === "journals" && (
                    <div className="space-y-6">
                      <h2 className="font-serif text-2xl text-white">The Journal</h2>
                      <p className="text-gray-400 text-sm">Latest stories and inspirations from Elaris Noir.</p>
                      
                      {articlesLoading ? (
                        <div className="text-center py-12">
                          <p className="text-gold animate-pulse">Loading journals...</p>
                        </div>
                      ) : articles.length === 0 ? (
                        <div className="text-center py-12 bg-midnight border border-white/5 rounded-sm">
                          <p className="text-gray-400">No journals found.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {articles.map((article) => (
                            <div key={article.id} className="bg-midnight border border-white/10 rounded-sm overflow-hidden group">
                              <div className="aspect-video relative overflow-hidden">
                                <Image 
                                  src={article.image_url} 
                                  alt={article.title}
                                  fill
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 bg-midnight/80 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold z-10">
                                  {article.category}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-serif text-white text-lg mb-2 line-clamp-1 group-hover:text-gold transition-colors">{article.title}</h3>
                                <p className="text-gray-400 text-xs line-clamp-2 mb-4 font-light">{article.excerpt}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full text-[10px] uppercase tracking-widest"
                                  onClick={() => router.push(`/journal/${article.id}`)}
                                >
                                  Read Article
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                )}
            </div>
        </div>
  );
}
