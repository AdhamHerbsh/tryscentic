<<<<<<< HEAD
import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import AOSInit from "./components/animation/AOSInit";
import { Providers } from "./Providers";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"], // optional: choose weights you need
=======
// app/layout.tsx
import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import AOSInit from "./components/animation/AOSInit";
import { CartProvider } from "./components/context/CartContext"; // استدعاء CartProvider

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
>>>>>>> master
  variable: "--font-cinzel",
});

const decorative = Cinzel_Decorative({
  subsets: ["latin"],
<<<<<<< HEAD
  weight: ["400", "700"], // optional
=======
  weight: ["400", "700"],
>>>>>>> master
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
<<<<<<< HEAD
        className={`${cinzel.variable} ${decorative.variable} antialiased bg-primary`}
      >
        <Providers>
          <AOSInit />
          {children}
        </Providers>
=======
        className={`${cinzel.variable} ${decorative.variable} antialiased text-gray-900 font-sans`}
      >
        <CartProvider> {/* هنا ضفنا الـ Provider */}
          <AOSInit />
          {children}
        </CartProvider>
>>>>>>> master
      </body>
    </html>
  );
}
