import { CartProvider } from "@/lib/context/CartContext";
import { OrderProvider } from "@/lib/context/OrderContext";
import AOSInit from "@/components/shared/AOSInit";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <AOSInit />
      <OrderProvider>
        <Header />
        {children}
        <Footer />
      </OrderProvider>
    </CartProvider>
  );
}
