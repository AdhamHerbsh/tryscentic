"use client";

import { Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WalletBalanceSectionProps {
    balance: number;
    isUsing: boolean;
    onToggle: () => void;
    isLoading?: boolean;
}

export default function WalletBalanceSection({ balance, isUsing, onToggle, isLoading }: WalletBalanceSectionProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Wallet size={18} className="text-indigo-400" />
                </div>
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Wallet Balance</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
                <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Available Credit</p>
                    <p className="text-2xl font-bold font-mono text-white tracking-tighter">LE {balance.toFixed(2)}</p>
                </div>

                <button
                    onClick={onToggle}
                    disabled={balance <= 0 || isLoading}
                    className={`relative h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${isUsing
                            ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : isUsing ? (
                        <>
                            <CheckCircle2 size={16} /> Applied
                        </>
                    ) : (
                        "Use Balance"
                    )}
                </button>
            </div>

            {isUsing && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-[10px] text-indigo-400 font-bold uppercase tracking-tight text-center italic"
                >
                    This amount will be deducted from your total
                </motion.p>
            )}
        </div>
    );
}
