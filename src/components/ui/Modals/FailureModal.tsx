"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";

interface FailureModalProps {
    isOpen: boolean;
    onClose: () => void;
    error: string;
}

export default function FailureModal({ isOpen, onClose, error }: FailureModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-md bg-zinc-900 border border-red-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]"
                    >
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <AlertCircle className="text-red-500 w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-serif font-bold text-white mb-2">Something Went Wrong</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                {error || "We encountered an unexpected error while processing your fragrance order."}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20"
                                >
                                    <RefreshCw size={18} /> Retry Payment
                                </button>

                                <Link
                                    href="/pages/contact-us"
                                    className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
                                >
                                    <MessageSquare size={18} /> Contact Concierge
                                </Link>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
