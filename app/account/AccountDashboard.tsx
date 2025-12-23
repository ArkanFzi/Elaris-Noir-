"use client";

import { Button } from "@/app/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");

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
                <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 rounded-sm transition-colors mt-8">
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 bg-white/5 p-8 rounded-sm min-h-[400px]">
                {activeTab === "overview" && (
                     <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-white">Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-midnight p-6 border border-white/10 rounded-sm">
                                <h4 className="text-gold text-sm uppercase tracking-widest mb-2">Total Orders</h4>
                                <p className="text-3xl text-white font-serif">12</p>
                            </div>
                            <div className="bg-midnight p-6 border border-white/10 rounded-sm">
                                <h4 className="text-gold text-sm uppercase tracking-widest mb-2">Member Status</h4>
                                <p className="text-3xl text-white font-serif">Gold</p>
                            </div>
                        </div>
                     </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-white">Recent Orders</h2>
                        <div className="text-sm text-gray-400 bg-midnight p-4 rounded-sm border border-white/5">
                            No recent orders found.
                        </div>
                    </div>
                )}
                
                {activeTab === "addresses" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                             <h2 className="font-serif text-2xl text-white">Saved Addresses</h2>
                             <Button variant="outline" size="sm">Add New</Button>
                        </div>
                        <div className="bg-midnight p-6 rounded-sm border border-gold/30 relative">
                             <span className="absolute top-2 right-2 text-[10px] bg-gold text-midnight px-2 py-0.5 rounded-full font-bold">DEFAULT</span>
                             <p className="text-white font-medium mb-1">Arkan Fauzi</p>
                             <div className="text-sm text-gray-400 leading-relaxed">
                                <p>Jalan Elaris Noir No. 1</p>
                                <p>Jakarta Selatan, 12345</p>
                                <p>Indonesia</p>
                             </div>
                             <div className="flex gap-4 mt-4 text-xs">
                                <button className="text-gold hover:underline">Edit</button>
                                <button className="text-gray-500 hover:text-red-400">Delete</button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
  );
}
