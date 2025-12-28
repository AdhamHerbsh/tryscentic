import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PromoCardProps {
    code: string;
    description: string;
    expiry: string;
    status: 'available' | 'used';
}

export default function PromoCard({ code, description, expiry, status }: PromoCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (status === 'used') return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Promo code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`
                group relative w-full rounded-3xl border p-6 transition-all duration-300 ease-out
                ${status === 'available'
                    ? 'border-white/10 bg-white/5 hover:-translate-1 hover:border-amber-500/50 hover:bg-white/10 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer'
                    : 'border-white/5 bg-black/20 opacity-60 grayscale cursor-not-allowed'}
            `}
            onClick={status === 'available' ? handleCopy : undefined}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className={`text-lg font-bold tracking-wide ${status === 'available' ? 'text-amber-500 group-hover:text-amber-400' : 'text-gray-400'}`}>
                            {code}
                        </h3>
                        {status === 'available' && (
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                                Click to Copy
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-300">
                        {description}
                    </p>
                    <p className="text-xs text-gray-500">
                        Expires: {expiry}
                    </p>
                </div>

                <button
                    disabled={status === 'used'}
                    className={`
                        flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300
                        ${copied
                            ? 'border-green-500 bg-green-500 text-black scale-110'
                            : status === 'available'
                                ? 'border-white/20 bg-white/5 text-gray-400 group-hover:border-amber-500 group-hover:text-amber-500'
                                : 'border-transparent bg-transparent text-gray-600'}
                    `}
                >
                    {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
                </button>
            </div>

            {/* Visual Flair (Optional background gradient effect on hover) */}
            {status === 'available' && (
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            )}
        </div>
    );
}
