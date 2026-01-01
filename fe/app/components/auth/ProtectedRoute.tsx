"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in -> Redirect to login
        router.push("/login");
      } else if (adminOnly && user.role !== "admin") {
        // Logged in but not admin -> Redirect to home
        router.push("/");
      }
    }
  }, [user, isLoading, adminOnly, router]);

  // Show nothing while loading or if unauthorized
  if (isLoading || !user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="flex bg-midnight min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
