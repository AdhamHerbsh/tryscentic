"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProcessingOverlay({ message = "Crafting your order..." }: { message?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
        >
            <div className="relative">
                {/* Luxury circular progress indication */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-t-2 border-b-2 border-secondary/50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-xl font-serif text-white tracking-widest uppercase"
            >
                {message}
            </motion.p>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="mt-4 h-px bg-linear-to-r from-transparent via-secondary to-transparent"
            />

            <p className="mt-4 text-xs text-secondary/60 font-medium tracking-tighter italic">
                Preparing your Grand Edition experience
            </p>
        </motion.div>
    );
}
