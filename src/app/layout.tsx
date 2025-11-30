import type { Metadata } from "next";
import { cinzel, cinzelDecorative } from "@/lib/fonts";
import { CartProvider } from "@/lib/context/CartContext";
import { OrderProvider } from "@/lib/context/OrderContext";
import AOSInit from "@/components/shared/AOSInit";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/utils/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "perfume",
    "fragrance",
    "authentic perfumes",
    "perfume samples",
    "luxury perfumes",
    "designer fragrances",
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cinzelDecorative.variable} antialiased bg-primary`}
      >
        <CartProvider>
          <AOSInit />
           <OrderProvider>
            {children}
          </OrderProvider>
          
        </CartProvider>
      </body>
    </html>
  );
}
