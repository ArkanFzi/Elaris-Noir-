"use client";

import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export function RegisterForm() {
    return (
        <div className="w-full max-w-md">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">Create Account</h1>
            
            <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">First Name</label>
                        <input type="text" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                        <input type="text" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input type="email" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Password</label>
                    <input type="password" required className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:border-gold focus:outline-none rounded-sm transition-colors" />
                </div>

                <Button className="w-full" size="lg">Create Account</Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                Already have an account? <Link href="/login" className="text-gold hover:underline">Log in</Link>
            </div>
        </div>
    );
}
