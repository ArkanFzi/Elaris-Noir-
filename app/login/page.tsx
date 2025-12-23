import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-6 flex justify-center">
        <LoginForm />
      </div>

      <Footer />
    </main>
  );
}
