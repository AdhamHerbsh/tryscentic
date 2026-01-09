"use client"
import { TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import TopUpModal from "./TopUpModal";
import { useUser } from "@/lib/context/UserContext";

interface BalanceHeroProps {
    balance: number; // Server-side initial balance
}

export default function BalanceHero({ balance: initialBalance }: BalanceHeroProps) {
    const { profile } = useUser();
    const balance = profile?.wallet_balance ?? initialBalance;
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    return (
        <>
            <div className="w-full relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 sm:p-10">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <div className="p-1.5 bg-amber-500/20 rounded-md">
                                <Wallet size={16} />
                            </div>
                            <span className="text-sm font-medium tracking-wider font-[system-ui]">AVAILABLE BALANCE</span>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2">LE {balance.toFixed(2)}</h1>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium font-[system-ui]">
                            <TrendingUp size={14} />
                            <span>+5% from last month</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsTopUpOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20 font-[system-ui]"
                    >
                        <div className="bg-black/10 p-1 rounded-full">
                            <Wallet size={16} />
                        </div>
                        TOP-UP WALLET
                    </button>
                </div>
            </div>

            <TopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </>
    );
}
