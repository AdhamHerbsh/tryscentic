"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Lock, X, CheckCircle2 } from "lucide-react";
import { topUpMethods } from "@/app/(app)/data/walletData";

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [selectedMethod, setSelectedMethod] = useState<string>(topUpMethods[0].id);
    const [loading, setLoading] = useState(false);

    // Close modal on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const presets = [50, 100, 200, 500];

    const handlePresetClick = (val: number) => {
        setAmount(val.toString());
    };

    const handleConfirm = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onClose();
            // In a real app, trigger a success toast or balance update here
        }, 1500);
    };

    const totalCharge = amount ? parseFloat(amount) : 0;
    const isAmountValid = totalCharge > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-16 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 m-0">
            <div className="w-full lg:w-1/3 bg-accent rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative animate-in zoom-in-50 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-white font-serif">Top-up Wallet</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="px-4 py-2 space-y-4">
                    {/* Section 1: Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase">
                            Amount to Top Up
                        </label>

                        <div className="relative group">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                autoFocus
                                min={50}
                                className="w-full bg-white text-black text-3xl font-bold py-4 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-shadow"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {presets.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handlePresetClick(val)}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${amount === val.toString()
                                        ? "bg-amber-500/20 border-amber-500 text-amber-500"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                >
                                    LE {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Payment Method */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-amber-500/80 tracking-widest uppercase">
                            Payment Method
                        </label>

                        <div className="space-y-3">
                            {topUpMethods.map((method) => {
                                const isActive = selectedMethod === method.id;
                                const Icon = method.icon;

                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isActive
                                            ? "bg-[#3A1C20] border-amber-500 shadow-lg shadow-amber-900/20"
                                            : "bg-zinc-800/50 border-transparent hover:bg-zinc-800"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${isActive ? "text-amber-500 bg-amber-500/10" : "text-gray-400 bg-white/5"}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold ${isActive ? "text-white" : "text-gray-300"}`}>
                                                    {method.label}
                                                </p>
                                                <p className="text-xs text-gray-500">{method.sub}</p>
                                            </div>
                                        </div>

                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-gray-600 bg-transparent"
                                            }`}>
                                            {isActive && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-sm font-[system-ui]">
                            <span className="text-gray-400">Processing fee</span>
                            <span className="text-white font-medium">LE 0.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white font-serif">Total Charge</span>
                            <span className="text-2xl font-bold text-amber-500">LE {totalCharge.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!isAmountValid || loading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                        >
                            {loading ? (
                                "Processing..."
                            ) : (
                                <>
                                    Confirm Top-up <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-200">
                            <Lock size={12} />
                            <span>Secured with 256-bit SSL encryption</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
