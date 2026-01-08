"use client";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";

interface OrderSummaryProps {
  shippingCost?: number;
  discountAmount?: number;
  walletDeduction?: number;
}

export default function OrderSummary({
  shippingCost = 0,
  discountAmount = 0,
  walletDeduction = 0
}: OrderSummaryProps) {
  const { cartItems, subtotal } = useCart();

  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount - walletDeduction);

  return (
    <div
      className="rounded-3xl p-8 h-fit text-white shadow-2xl relative overflow-hidden group"
      style={{ backgroundColor: '#2A1016' }} // Darker, more luxury tone
    >
      {/* Background Decorative Gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 blur-3xl rounded-full group-hover:bg-secondary/20 transition-all duration-700" />

      <h2 className="text-xl font-bold mb-8 uppercase tracking-[0.2em] text-secondary/80 flex items-center gap-3">
        Order Summary
      </h2>

      <div className="space-y-6 pb-6 border-b border-white/5">
        {cartItems.length === 0 ? (
          <p className="text-white/40 italic text-sm">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group/item">
              <div className="relative w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2 shrink-0 group-hover/item:border-secondary/30 transition-colors">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm text-white truncate pr-2 tracking-tight">{item.name}</p>
                  <p className="font-mono text-sm font-bold text-white shrink-0">
                    LE {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                  Qty: {item.quantity} · LE {item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 space-y-4 font-medium">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
          <span className="font-mono text-white">LE {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-amber-500">
          <span className="text-amber-500/60 uppercase tracking-widest text-[10px] font-bold">Shipping (Est.)</span>
          <span className="font-mono">+ LE {shippingCost.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-400">
            <span className="uppercase tracking-widest text-[10px] font-bold">Promo Discount</span>
            <span className="font-mono">- LE {discountAmount.toFixed(2)}</span>
          </div>
        )}

        {walletDeduction > 0 && (
          <div className="flex justify-between items-center text-sm text-indigo-400">
            <span className="uppercase tracking-widest text-[10px] font-bold">Wallet Credit</span>
            <span className="font-mono">- LE {walletDeduction.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-1">Total Payable</p>
            <p className="text-3xl font-bold text-white tracking-tighter">LE {grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
