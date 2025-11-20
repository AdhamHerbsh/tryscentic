// app/layout.tsx
import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import AOSInit from "./components/animation/AOSInit";
import { CartProvider } from "./components/context/CartContext"; // استدعاء CartProvider

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
});

const decorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-decorative",
});

export const metadata: Metadata = {
  title: "TryScentic",
  description:
    "Tryscentic offers 100% authentic Perfumes samples and full bottle You can now experience rare fragrance at exceptional prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${decorative.variable} antialiased text-gray-900 font-sans`}
      >
        <CartProvider> {/* هنا ضفنا الـ Provider */}
          <AOSInit />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
