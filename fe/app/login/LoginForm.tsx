"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
      login(data.token, { id: data.user.id || data.id, email });
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">
        Login
      </h1>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <input
            type="email"
            required
            disabled={isLoading}
            className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors disabled:opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm text-gray-400">Password</label>
            <a href="#" className="text-xs text-gold hover:underline">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            required
            disabled={isLoading}
            className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors disabled:opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-gold hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
}
