import { useState, useEffect } from "react";
import { Ticket, Loader2, CheckCircle2, XCircle, ChevronRight, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivePromoCodes } from "@/data-access/promo-codes";

interface PromoCodeInputProps {
    onApply: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
    onRemove: () => void;
    appliedCode: string | null;
}

export default function PromoCodeInput({ onApply, onRemove, appliedCode }: PromoCodeInputProps) {
    const [code, setCode] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOffers, setShowOffers] = useState(false);
    const [offers, setOffers] = useState<any[]>([]);
    const [loadingOffers, setLoadingOffers] = useState(false);

    useEffect(() => {
        if (showOffers) {
            setLoadingOffers(true);
            getActivePromoCodes().then(data => {
                setOffers(data);
                setLoadingOffers(false);
            });
        }
    }, [showOffers]);

    const handleApply = async (targetCode: string) => {
        const codeToUse = targetCode || code;
        if (!codeToUse.trim()) return;
        setIsApplying(true);
        setError(null);
        try {
            const result = await onApply(codeToUse);
            if (!result.success) {
                setError(result.message);
            } else {
                setCode("");
                setShowOffers(false);
            }
        } catch (err) {
            setError("Failed to apply promo code");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Ticket size={18} className="text-amber-500" />
                    </div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Promo Code</h3>
                </div>
                {!appliedCode && (
                    <button
                        onClick={() => setShowOffers(true)}
                        className="text-[10px] text-amber-500/60 hover:text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                        View Offers <ChevronRight size={12} />
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {appliedCode ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">{appliedCode}</span>
                        </div>
                        <button
                            onClick={onRemove}
                            className="text-xs text-green-500/60 hover:text-green-500 transition-colors uppercase font-bold"
                        >
                            Remove
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                    >
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Enter Code"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                                onKeyDown={(e) => e.key === "Enter" && handleApply(code)}
                            />
                            <button
                                onClick={() => handleApply(code)}
                                disabled={isApplying || !code.trim()}
                                className="bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isApplying ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                            </button>
                        </div>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-tight"
                            >
                                <XCircle size={12} /> {error}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Offers Modal Overlay */}
            <AnimatePresence>
                {showOffers && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Gift className="text-secondary" /> Available Offers
                                    </h2>
                                    <button onClick={() => setShowOffers(false)} className="text-gray-500 hover:text-white">
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                {loadingOffers ? (
                                    <div className="flex flex-col items-center py-10">
                                        <Loader2 className="animate-spin text-secondary mb-2" />
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Searching for codes...</p>
                                    </div>
                                ) : offers.length === 0 ? (
                                    <p className="text-center py-10 text-gray-500 text-sm">No active offers at the moment.</p>
                                ) : (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {offers.map((offer) => (
                                            <button
                                                key={offer.id}
                                                onClick={() => handleApply(offer.code)}
                                                className="w-full text-left p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-secondary/30 transition-all"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono font-bold text-secondary tracking-widest">{offer.code}</span>
                                                    <span className="text-[10px] font-bold text-green-400 uppercase">
                                                        {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `LE ${offer.discount_value} OFF`}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-1">{offer.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
