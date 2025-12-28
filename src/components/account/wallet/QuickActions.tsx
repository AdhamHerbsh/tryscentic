"use client";
import { useState } from "react";
import { CreditCard, FileText, PlusCircle } from "lucide-react";
import TopUpModal from "./TopUpModal";

const actions = [
    { label: "Top Up", icon: PlusCircle, bg: "bg-amber-500/10", color: "text-amber-500", click: true },
    { label: "Statement", icon: FileText, bg: "bg-amber-500/10", color: "text-amber-500", click: false },
    { label: "Methods", icon: CreditCard, bg: "bg-amber-500/10", color: "text-amber-500", click: false },
];

export default function QuickActions() {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    return (
        <>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => setIsTopUpOpen(action.click)}
                        className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-95"
                    >
                        <div className={`p-4 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon size={28} />
                        </div>
                        <span className="text-gray-300 font-medium font-[system-ui]">{action.label}</span>
                    </button>
                ))}
            </div>
            <TopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </>
    );
}
