"use client";
import { X, CreditCard, PlusCircle, AlertCircle } from "lucide-react";
import { topUpMethods } from "@/app/(app)/data/walletData";

interface MethodsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MethodsModal({ isOpen, onClose }: MethodsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-serif">Payment Methods</h2>
                            <p className="text-sm text-gray-400">Manage your saved payment options</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Info Alert */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-400">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold mb-1">Manual Transfer Only</p>
                            <p className="opacity-80">Currently, we only support manual transfers via Vodafone Cash and InstaPay. Saved cards are temporarily disabled.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Supported Top-Up Methods</h3>
                        {topUpMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <div key={method.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-white/5 text-gray-400">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{method.label}</p>
                                            <p className="text-xs text-gray-500">{method.sub}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Active</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5">
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-dashed border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                        <PlusCircle size={18} />
                        Add New Method
                    </button>
                    <p className="text-center text-xs text-gray-600 mt-2">Features coming soon</p>
                </div>
            </div>
        </div>
    );
}
