"use client";

import { useEffect, useState } from "react";
import {
    Gift,
    Plus,
    Loader2,
    Search,
    User,
    Mail,
    Calendar,
    CheckCircle2,
    Activity,
    ArrowRight,
    Send,
    X
} from "lucide-react";
import { getAllGifts, adminSendGift } from "@/data-access/admin/gifts";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGiftsPage() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Create Gift State
    const [newGift, setNewGift] = useState({
        amount: 0,
        recipientEmail: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchGifts = async () => {
        setLoading(true);
        try {
            const data = await getAllGifts();
            setGifts(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleSendGift = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGift.recipientEmail || newGift.amount <= 0) return;

        setIsSubmitting(true);
        try {
            await adminSendGift(newGift);
            toast.success("System gift issued successfully!");
            setIsModalOpen(false);
            setNewGift({ amount: 0, recipientEmail: "" });
            fetchGifts();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredGifts = gifts.filter(g =>
        g.code.toLowerCase().includes(search.toLowerCase()) ||
        g.recipient_email?.toLowerCase().includes(search.toLowerCase()) ||
        g.creator?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Gift className="text-secondary" size={32} /> Gift Management
                        </h1>
                        <p className="text-gray-400 mt-2">Track user-to-user gifts and issue system rewards</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,160,32,0.3)] transition-all"
                    >
                        <Send size={20} /> Issue System Gift
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by code, sender, or recipient..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-gray-400 text-sm">
                        <Activity size={16} className="text-secondary" />
                        <span>Total: {gifts.length}</span>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-secondary" size={40} />
                        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Scanning gift ledger...</p>
                    </div>
                ) : filteredGifts.length === 0 ? (
                    <div className="bg-gray-900 border border-white/10 rounded-3xl p-20 text-center">
                        <Gift className="mx-auto text-white/5 mb-6" size={80} />
                        <h3 className="text-xl font-bold text-gray-300">No Gift Records</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">No gifts have been issued or purchased yet.</p>
                    </div>
                ) : (
                    <div className="bg-gray-900/50 border border-white/10 rounded-3xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Code / Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sender / Recipient</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredGifts.map((gift) => (
                                    <tr key={gift.code} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${gift.is_active ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                                {gift.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-mono">
                                            <p className="text-white font-bold tracking-widest text-sm mb-1">{gift.code}</p>
                                            <p className="text-secondary font-bold">LE {gift.amount}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                        <User size={12} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-300">{gift.creator?.full_name || 'System / Admin'}</p>
                                                        <p className="text-[10px] text-gray-500">{gift.creator?.email || 'admin@tryscentic.com'}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={12} className="text-gray-700 ml-2" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                        <Mail size={12} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">{gift.recipient_email || 'Anyone'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {!gift.is_active && gift.redeemer ? (
                                                <div className="bg-green-500/5 rounded-xl p-3 border border-green-500/10">
                                                    <p className="text-[10px] text-green-500 font-bold uppercase mb-1">Redeemed By</p>
                                                    <p className="text-[10px] text-white font-medium">{gift.redeemer.full_name || gift.redeemer.email}</p>
                                                    <p className="text-[9px] text-gray-500 mt-1">{format(new Date(gift.redeemed_at), 'MMM dd, HH:mm')}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">Awaiting redemption</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-xs text-gray-400">{format(new Date(gift.created_at), 'MMM dd, yyyy')}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Issue Gift Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Plus className="text-secondary" /> Issue System Gift
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSendGift} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Amount (LE)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="e.g. 500"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-secondary transition-colors"
                                            value={newGift.amount || ""}
                                            onChange={(e) => setNewGift({ ...newGift, amount: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Recipient Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="user@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-secondary transition-colors"
                                            value={newGift.recipientEmail}
                                            onChange={(e) => setNewGift({ ...newGift, recipientEmail: e.target.value })}
                                        />
                                    </div>

                                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl">
                                        <p className="text-[10px] text-secondary leading-relaxed font-bold uppercase tracking-tight">
                                            Attention: System gifts do not deduct from any wallet balance. They are generated as complimentary credit.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-6 py-4 bg-secondary text-primary font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(240,160,32,0.3)] transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Issue Gift</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
