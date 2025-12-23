import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { AccountDashboard } from "./AccountDashboard";

export default function Account() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-6">
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">My Account</h1>
        <p className="text-gray-400 mb-12">Welcome back, Arkan.</p>

        <AccountDashboard />
      </div>

      <Footer />
    </main>
  );
}
