"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: Submit handler triggered");
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
        throw new Error(errorData.error || errorData.message || "Failed to login");
      }

      const data = await response.json();
      console.log("LoginForm: Response data", data);

      // Ensure backend login handler returns `user` object now.
      // If `data.user` is present, it will contain { id, email, role, ... }
      const userData = data.user || { id: data.id, email };
      login(data.token, userData);

      showToast("Signed in successfully. Welcome to Elaris Noir.", "success");

      if (userData.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-midnight/30 backdrop-blur-md border border-white/10 shadow-2xl p-8 md:p-10 rounded-2xl relative overflow-hidden group/card">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover/card:bg-gold/10 transition-colors duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover/card:bg-blue-500/10 transition-colors duration-1000" />

        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2 text-center tracking-wide">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm uppercase tracking-widest">
          Enter your details to access your account
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="group">
            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">Email Address</label>
            <input
              type="email"
              required
              disabled={isLoading}
              className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <div className="flex justify-between mb-1 ml-1">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">Password</label>
              <a href="#" className="text-xs text-gray-500 hover:text-gold transition-colors">
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              required
              disabled={isLoading}
              className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gradient-to-r from-gold to-amber-600 text-midnight"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-midnight rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-midnight rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-midnight rounded-full animate-bounce" />
              </span>
            ) : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold font-medium hover:text-white transition-colors hover:underline decoration-gold/50 underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
