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
import { SearchOverlay } from "./components/ui/SearchOverlay";
import { QuickViewModal } from "./components/ui/QuickViewModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body 
        className="antialiased bg-midnight text-mist selection:bg-gold selection:text-midnight"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <CartDrawer />
          <NewsletterPopup />
          <SearchOverlay />
          <QuickViewModal />
        </Providers>
      </body>
    </html>
  );
}
