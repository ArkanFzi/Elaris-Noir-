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
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }

      const data = await response.json();
      login(data.token, { id: data.user.id || data.id, email }); // Store user data in AuthContext
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">
        Create Account
      </h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <input
            type="email"
            required
            className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Password</label>
          <input
            type="password"
            required
            className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            required
            className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>

      <p className="text-sm text-gray-400 mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-gold">
          Login
        </Link>
      </p>
    </div>
  );
}
