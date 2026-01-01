"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset pesan error sebelumnya

    // Validasi dasar di sisi client
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 1. Ambil API URL dari environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        // Beri pesan error yang jelas jika URL tidak terkonfigurasi
        throw new Error("API URL is not configured in the frontend.");
      }

      // 2. Lakukan request dengan fetch
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      // 3. Periksa jika response dari server adalah error (spt: 400, 500)
      if (!response.ok) {
        const errorData = await response.json();
        // Tampilkan pesan error dari backend jika ada
        throw new Error(
          errorData.error || errorData.message || "Registration failed on the server.",
        );
      }

      const data = await response.json();

      // Sukses! Lanjutkan proses login atau redirect
      // Note: Backend register response might need update to return full user object, 
      // but for now we construct minimal user object.
      login(data.token, { 
        id: data.user.id, 
        email: email, // use local state email 
        first_name: firstName,
        last_name: lastName,
        role: "customer"
      });
      router.push("/account"); // Redirect ke halaman akun setelah sukses
    } catch (err) {
      // 4. Tangkap semua jenis error (jaringan, server, dll)
      console.error("Registration error:", err);
      if (err instanceof Error) {
        if (err.message === "Failed to fetch") {
          setError(
            "Unable to connect to the server. Please ensure the backend is running."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-midnight/30 backdrop-blur-md border border-white/10 shadow-2xl p-8 md:p-10 rounded-2xl relative overflow-hidden group/card">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover/card:bg-gold/10 transition-colors duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover/card:bg-blue-500/10 transition-colors duration-1000" />

        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2 text-center tracking-wide">
            Create Account
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm uppercase tracking-widest">
            Join the world of Elaris Noir
        </p>

        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6 flex flex-col items-center animate-in fade-in zoom-in-95">
                <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
        )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="group">
            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">Email</label>
          <input
            type="email"
            required
            className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="group">
          <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">Password</label>
          <input
            type="password"
            required
            className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="group">
          <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-gold transition-colors duration-300">
            Confirm Password
          </label>
          <input
            type="password"
            required
            className="w-full bg-black/20 border border-white/10 border-b-white/20 p-4 text-sm text-white placeholder-gray-600 focus:border-gold focus:border-b-gold focus:ring-0 focus:outline-none rounded-lg transition-all duration-300 hover:bg-black/30"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <Button 
            type="submit" 
            className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gradient-to-r from-gold to-amber-600 text-midnight"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-gold font-medium hover:text-white transition-colors hover:underline decoration-gold/50 underline-offset-4">
          Login
        </Link>
      </div>
     </div>
    </div>
  );
}
