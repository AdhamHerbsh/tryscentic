import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import AOSInit from "./components/animation/AOSInit";
import { Providers } from "./Providers";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"], // optional: choose weights you need
  variable: "--font-cinzel",
});

const decorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"], // optional
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
        className={`${cinzel.variable} ${decorative.variable} antialiased bg-primary`}
      >
        <Providers>
          <AOSInit />
          {children}
        </Providers>
      </body>
    </html>
  );
}
