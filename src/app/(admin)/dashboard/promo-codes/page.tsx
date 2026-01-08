"use client";

import { useEffect, useState } from "react";
import {
    Ticket,
    Plus,
    Loader2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Search,
    Calendar,
    Layers,
    Percent,
    Activity
} from "lucide-react";
import {
    getPromoCodes,
    createPromoCode,
    togglePromoCode,
    deletePromoCode
} from "@/data-access/admin/promo-codes";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("");

    // Create Modal State
    const [newPromo, setNewPromo] = useState({
        code: "",
        description: "",
        discount_type: "percentage" as "percentage" | "fixed",
        discount_value: 0,
        min_order_amount: 0,
        usage_limit: null as number | null,
        expires_at: ""
    });

    const fetchPromoCodes = async () => {
        setLoading(true);
        try {
            const res = await getPromoCodes({ limit: 50 });
            setPromoCodes(res.promoCodes);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPromoCode({
                ...newPromo,
                expires_at: newPromo.expires_at ? new Date(newPromo.expires_at).toISOString() : null
            });
            toast.success("Promo code created successfully");
            setIsModalOpen(false);
            setNewPromo({
                code: "",
                description: "",
                discount_type: "percentage",
                discount_value: 0,
                min_order_amount: 0,
                usage_limit: null,
                expires_at: ""
            });
            fetchPromoCodes();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleToggle = async (id: string, active: boolean) => {
        try {
            await togglePromoCode(id, !active);
            toast.success(`Promo code ${!active ? 'activated' : 'deactivated'}`);
            fetchPromoCodes();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Are you sure you want to delete promo code ${code}?`)) return;
        try {
            await deletePromoCode(id);
            toast.success("Promo code deleted");
            fetchPromoCodes();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const filteredPromos = promoCodes.filter(p =>
        p.code.toLowerCase().includes(filter.toLowerCase()) ||
        p.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Ticket className="text-secondary" size={32} /> Promo Codes
                        </h1>
                        <p className="text-gray-400 mt-2">Manage customer discounts and marketing campaigns</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,160,32,0.3)] transition-all"
                    >
                        <Plus size={20} /> Create New Code
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search code or description..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-gray-400 text-sm">
                        <Activity size={16} className="text-secondary" />
                        <span>Total: {promoCodes.length}</span>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-secondary" size={40} />
                        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Fetching codes...</p>
                    </div>
                ) : filteredPromos.length === 0 ? (
                    <div className="bg-gray-900 border border-white/10 rounded-3xl p-20 text-center">
                        <Ticket className="mx-auto text-white/5 mb-6" size={80} />
                        <h3 className="text-xl font-bold text-gray-300">No Codes Found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">Start by creating your first promotional discount code.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPromos.map((promo) => (
                            <div
                                key={promo.id}
                                className="bg-gray-900 border border-white/10 rounded-3xl overflow-hidden hover:border-secondary/30 transition-all group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${promo.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {promo.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleToggle(promo.id, promo.is_active)}
                                                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                                                title={promo.is_active ? "Deactivate" : "Activate"}
                                            >
                                                {promo.is_active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo.id, promo.code)}
                                                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-mono font-bold text-white mb-1 tracking-tighter">#{promo.code}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">{promo.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Discount</p>
                                            <p className="text-xl font-bold text-secondary">
                                                {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `LE ${promo.discount_value}`}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Usage</p>
                                            <p className="text-xl font-bold text-white">
                                                {promo.times_used}{promo.usage_limit ? ` / ${promo.usage_limit}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={14} className="text-gray-600" />
                                            <span>Expires: {promo.expires_at ? format(new Date(promo.expires_at), 'MMM dd, yyyy') : 'Indefinite'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Layers size={14} className="text-gray-600" />
                                            <span>Min Order: LE {promo.min_order_amount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal Overlay */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Plus className="text-secondary" /> Create Promo Code
                                </h2>

                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Code</label>
                                            <input
                                                required
                                                placeholder="e.g. SUMMER50"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors uppercase"
                                                value={newPromo.code}
                                                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Type</label>
                                            <select
                                                className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                                                value={newPromo.discount_type}
                                                onChange={(e) => setNewPromo({ ...newPromo, discount_type: e.target.value as any })}
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (LE)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Description</label>
                                        <textarea
                                            required
                                            placeholder="Show this message to customers..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors min-h-[80px]"
                                            value={newPromo.description}
                                            onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                                {newPromo.discount_type === 'percentage' ? 'Percent Off' : 'Amount Off'}
                                            </label>
                                            <div className="relative">
                                                {newPromo.discount_type === 'percentage' ? <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} /> : <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">LE</span>}
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.01"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                                                    value={newPromo.discount_value}
                                                    onChange={(e) => setNewPromo({ ...newPromo, discount_value: parseFloat(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Min Order</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">LE</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                                                    value={newPromo.min_order_amount}
                                                    onChange={(e) => setNewPromo({ ...newPromo, min_order_amount: parseFloat(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Usage Limit</label>
                                            <input
                                                type="number"
                                                placeholder="Unlimited if empty"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                                                onChange={(e) => setNewPromo({ ...newPromo, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Expiry Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm scheme-dark focus:outline-none focus:border-secondary transition-colors"
                                                value={newPromo.expires_at}
                                                onChange={(e) => setNewPromo({ ...newPromo, expires_at: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-secondary text-primary font-bold rounded-xl hover:shadow-[0_0_20px_rgba(240,160,32,0.3)] transition-all"
                                        >
                                            Create Code
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
