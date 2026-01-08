"use client";

import { motion } from "framer-motion";

export default function SuccessAnimations() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full animate-pulse decoration-inner delay-1000" />

            {/* Floating Gold Particles (Gold Mist) */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        scale: 0,
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%"
                    }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [0, 1.5, 0],
                        y: ["-10%", "-50%"],
                        x: ["0%", (Math.random() - 0.5) * 20 + "%"]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-secondary rounded-full shadow-[0_0_10px_#F0A020]"
                />
            ))}

            {/* Fading Mist Clouds */}
            <motion.div
                animate={{
                    x: ["-20%", "20%"],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-linear-to-b from-secondary/10 to-transparent blur-3xl opacity-10"
            />
        </div>
    );
}
