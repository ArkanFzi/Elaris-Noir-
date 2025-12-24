"use client";

import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  return (
     <div className="w-full max-w-md">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">Login</h1>
            
            <form className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input type="email" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                </div>
                <div>
                     <div className="flex justify-between mb-2">
                        <label className="block text-sm text-gray-400">Password</label>
                        <a href="#" className="text-xs text-gold hover:underline">Forgot?</a>
                     </div>
                    <input type="password" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                </div>

                <Button className="w-full" size="lg">Sign In</Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                Don't have an account? <Link href="/register" className="text-gold hover:underline">Create one</Link>
            </div>
        </div>
  );
}
