"use client";

import { useEffect, useState } from "react";
import { Gift, CheckCircle2, Clock, Copy, ExternalLink, Loader2 } from "lucide-react";
import { getMyGifts } from "@/actions/gift-actions";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MyGiftsSection() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const data = await getMyGifts();
                setGifts(data);
            } catch (error) {
                console.error("Failed to fetch gifts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGifts();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Code copied!");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-secondary" size={32} />
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading your gifts...</p>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Gift className="text-secondary" /> My Gift Purchases
                </h2>
            </div>

            {/* Process Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                    { step: "01", title: "Purchase", desc: "Choose a luxury gift card amount." },
                    { step: "02", title: "Share", desc: "Copy the unique code and send it to your loved one." },
                    { step: "03", title: "Redeem", desc: "They can enter the code in their Wallet to add balance." },
                ].map((item) => (
                    <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                        <span className="text-2xl font-black text-secondary/60">{item.step}</span>
                        <div>
                            <p className="text-md font-bold text-white uppercase tracking-wider">{item.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {gifts.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                    <Gift className="mx-auto text-white/10 mb-4" size={48} />
                    <p className="text-gray-400">You haven't purchased any gift cards yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gifts.map((gift) => (
                        <div
                            key={gift.code}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-secondary/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${gift.is_active ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {gift.is_active ? 'Active' : 'Redeemed'}
                                </div>
                                <p className="text-xl font-bold text-white">LE {gift.amount}</p>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5 mb-4 font-mono">
                                <span className="text-secondary tracking-widest font-bold">{gift.code}</span>
                                <button
                                    onClick={() => copyToClipboard(gift.code)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {gift.recipient_email && (
                                    <p className="text-xs text-gray-400 font-medium">
                                        Recipient: <span className="text-white">{gift.recipient_email}</span>
                                    </p>
                                )}
                                {!gift.is_active && gift.redeemer && (
                                    <p className="text-xs text-gray-500 font-medium italic">
                                        Redeemed by {gift.redeemer.full_name || gift.redeemer.email} on {format(new Date(gift.redeemed_at), 'MMM dd, yyyy')}
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tight">
                                    Purchased on {format(new Date(gift.created_at), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
