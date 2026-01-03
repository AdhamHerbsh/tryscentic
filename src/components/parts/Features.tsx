"use client";

import { Zap, Sparkles, ShieldCheck, Clock } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-10 h-10 text-secondary" />,
        title: "🚀 Xpress Delivery",
        description: "Receive your perfume samples within hours. Fast, reliable, and designed for instant fragrance discovery.",
    },
    {
        icon: <Sparkles className="w-10 h-10 text-secondary" />,
        title: "✨ Try Before You Invest",
        description: "Experience rare and luxury niche perfumes in samples before committing to a full bottle.",
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
        title: "🛡 7-Day Warranty",
        description: "Every item is covered by a 7-day authenticity and condition warranty. This applies only in the rare case of a defective product or an authenticity concern.",
    },
    {
        icon: <Clock className="w-10 h-10 text-secondary" />,
        title: "🕓 24/7 Support",
        description: "Our fragrance specialists are always available to assist you anytime, day or night.",
    },
];

export default function Features() {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <div className="mb-8 text-center lg:mb-12">
                    <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Why You Choose !?</h2>
                    <p className="mt-4 text-2xl font-bold">Discover <span className="text-secondary">Tryscentic</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-secondary/50 transition-all duration-500 hover:transform hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                {feature.icon}
                            </div>

                            <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/40 text-secondary group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/5">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-secondary transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-white/60 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
