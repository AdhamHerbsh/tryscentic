"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ShippingForm from "../../parts/ShippingForm";
import OrderSummary from "../../parts/OrderSummary";
import { CartItem } from "../../../types/cart";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, []);

  // ارتفاع الهيدر الافتراضي
  const HEADER_HEIGHT_CLASS = "mt-20"; // mt-20 ≈ 80px

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2b0505] to-[#0d0303] text-white">
      
      {/* Header ثابت */}
      <div className="fixed top-0 w-full z-50 h-20">
        <Header />
      </div>

      {/* Main content */}
      <main className={`flex-1 px-4 lg:px-10 ${HEADER_HEIGHT_CLASS}`}>
        <div className="max-w-7xl mx-auto relative">
          
          {/* رابط Back to Shop */}
        <a
  href="/pages/shop"
  className="inline-block w-full text-sm text-white/70 hover:text-white transition-colors border-b border-white/20 pb-1 mb-4 text-right"
>
  Back to Shop
</a>

          {/* الصفحة الفعلية */}
          <div className="pt-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <ShippingForm />
            </div>

            <OrderSummary cartItems={cartItems} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
