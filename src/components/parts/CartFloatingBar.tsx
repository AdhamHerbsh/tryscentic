"use client";

import { useCart } from "@/lib/context/CartContext";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartFloatingBar() {
    const { totalItems, subtotal } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (totalItems > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [totalItems]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Link
                href="/pages/checkout"
                className="flex items-center justify-between bg-[#511624] text-white p-4 rounded-2xl shadow-2xl shadow-[#511624]/30 border border-white/10 backdrop-blur-md hover:bg-[#511624]/90 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl text-amber-200">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white/60 font-medium uppercase tracking-wider">
                            {totalItems} items in cart
                        </span>
                        <span className="font-bold text-lg font-serif">
                            LE {subtotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl group-hover:bg-white/20 transition-colors">
                    <span className="text-sm font-semibold">Checkout</span>
                    <ArrowRight size={16} />
                </div>
            </Link>
        </div>
    );
}
