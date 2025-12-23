import type { Metadata } from "next";
import { playfair, lato } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elaris Noir | Timeless Elegance",
  description: "Discover the essence of luxury with Elaris Noir perfumes.",
};

import { Providers } from "./providers";
import { CartDrawer } from "./components/CartDrawer";
import { NewsletterPopup } from "./components/ui/NewsletterPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased bg-midnight text-mist selection:bg-gold selection:text-midnight">
        <Providers>
          {children}
          <CartDrawer />
          <NewsletterPopup />
        </Providers>
      </body>
    </html>
  );
}
