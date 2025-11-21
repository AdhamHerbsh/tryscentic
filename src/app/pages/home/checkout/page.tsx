// app/home/checkout/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-[#2b0505] to-[#0d0303] text-white pt-24 px-4 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="w-full h-1 bg-white/10 mb-10 relative">
              <div className="h-1 bg-[#f0a020] w-1/3"></div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form className="space-y-4 max-w-xl">
              <input className="w-full p-3 rounded bg-white/10 border border-white/10" placeholder="Full Name" />
              <input className="w-full p-3 rounded bg-white/10 border border-white/10" placeholder="Address" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className="p-3 rounded bg-white/10 border border-white/10" placeholder="City" />
                <input className="p-3 rounded bg-white/10 border border-white/10" placeholder="State/Province" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className="p-3 rounded bg-white/10 border border-white/10" placeholder="ZIP/Postal Code" />
                <input className="p-3 rounded bg-white/10 border border-white/10" placeholder="Country" />
              </div>
              <input className="w-full p-3 rounded bg-white/10 border border-white/10" placeholder="Phone Number" />
            </form>
            <button className="mt-8 px-6 py-3 bg-[#f0a020] text-black font-semibold rounded">Continue to Payment</button>
          </div>

          {/* RIGHT */}
          <div className="bg-white/10 border border-white/10 rounded-xl p-6 h-fit mb-9">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-400">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Image src={item.image} alt={item.name} width={60} height={60} />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-300 text-sm">{item.brand}</p>
                    </div>
                    <p>${item.price}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>$165.00</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$5.00</span></div>
              <div className="flex justify-between text-lg font-semibold mt-2"><span>Grand Total</span><span>$170.00</span></div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <input placeholder="Promo Code" className="flex-1 p-2 rounded bg-white/10 border border-white/10" />
              <button className="px-4 bg-[#f0a020] text-black rounded font-semibold">Apply</button>
            </div>
            <div className="mt-4 text-sm flex flex-col sm:flex-row justify-between items-center gap-2">
              <p>
                Wallet Balance: 
                <span className="font-semibold text-[#f0a020]"> $50.00</span>
              </p>
              <button className="text-[#f0a020] font-semibold">Use Balance</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
