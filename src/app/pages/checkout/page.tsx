"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ShippingForm from "../../parts/ShippingForm";
import OrderSummary from "../../parts/OrderSummary";
import PaymentSection from "../../parts/PaymentSection";
import { useRef } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const paymentRef = useRef<HTMLDivElement>(null);

  const HEADER_HEIGHT_CLASS = "mt-20";

  const handleContinue = () => {
    paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          <div className="inline-block w-full text-sm text-right mb-4">
            <Link
              href="/pages/shop"
              className="text-white/70 hover:text-white transition-colors border-b border-white/20 pb-1"
            >
              Back to Shop
            </Link>
          </div>

          {/* Shipping Form + Full OrderSummary */}
          <div className="pt-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <ShippingForm onContinue={handleContinue} />
            </div>

            <div className="lg:col-span-1 self-start">
              <OrderSummary kind="full" />
            </div>
          </div>
        </div>
      </main>

      {/* Payment Section + Compact OrderSummary */}
      <div className="w-full flex justify-center px-4 md:px-0 pb-20">
        <div className="flex flex-col md:flex-row w-full max-w-7xl gap-10 items-start">
          {/* Payment Methods */}
          <div ref={paymentRef} className="w-full md:w-2/3 order-1">
            <PaymentSection />
          </div>

          {/* Compact OrderSummary */}
          <div className="w-full md:w-1/3 order-2">
            <OrderSummary kind="summary" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
