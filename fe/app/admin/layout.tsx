"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { LayoutDashboard, Package, FileText, Users, MessageSquare, LogOut, ShoppingCart } from "lucide-react";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Articles", href: "/admin/articles", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-midnight text-mist flex">
        {/* Sidebar */}
        <div className="w-64 bg-midnight-light border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h4 className="font-serif text-lg text-gold">Admin Panel</h4>
            <p className="text-sm text-gray-400 mt-1">Elaris Noir</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {adminLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-midnight font-bold text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-midnight border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif text-white">Admin Dashboard</h3>
              <Link href="/" className="text-gold hover:text-white transition-colors">
                ← Back to Site
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
