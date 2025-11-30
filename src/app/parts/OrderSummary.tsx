"use client";

import Image from "next/image";
import { useCart } from "@/lib/context/CartContext"; 

export default function OrderSummary() {
  const { cartItems, subtotal } = useCart();

  const shipping = 5.0; 
  const grandTotal = subtotal + shipping;
  const walletBalance = 50.0; 

  return (
   <div
  className="rounded-xl p-6 h-fit text-white"
  style={{ backgroundColor: '#5D4348' }}
>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4 pb-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-300">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <div className="flex-1 flex justify-between items-center pr-2">
                <div>
                  <p className="font-medium text-base">{item.name}</p>
                  <p className="text-gray-300 text-sm">{item.price}</p>
                </div>

                <p className="font-medium text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="border-t border-white/20 my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
      </div>

      <hr className="border-t border-white/20 my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>Grand Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm">Promo Code</p>
        <div className="flex gap-2">
          <input
            placeholder="Enter code"
            className="flex-1 p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <button className="px-4 py-2 bg-[#393631] text-black rounded font-medium text-sm hover:bg-opacity-90 transition-colors">
            Apply
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center p-3 bg-[#393631] rounded-lg">
        <div className="text-sm flex flex-col">
          <p>Wallet Balance:</p>
          <span className="font-bold text-lg text-[#F0A020]">
            ${walletBalance.toFixed(2)}
          </span>
        </div>

        <button className="text-[#F0A020] font-semibold text-sm hover:underline">
          Use Balance
        </button>
      </div>
    </div>
  );
}
