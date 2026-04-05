import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zynzyr | Premium Fashion",
  description: "Exclusive fashion boutique.",
};

import { CartProvider } from "@/providers/CartProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <CartProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}

