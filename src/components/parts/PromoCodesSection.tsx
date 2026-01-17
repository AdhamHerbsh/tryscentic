"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import type { PromoCode } from "@/types/database";

import PromoCard from "@/components/ui/Cards/PromoCard";

export default function PromoCodesSection() {
    const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
    const [promos, setPromos] = useState<{ available: PromoCode[], used: PromoCode[] }>({ available: [], used: [] });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const { data, error } = await supabase
                    .from('promo_codes')
                    .select('*')
                    .order('expires_at', { ascending: true }); // Expiring soonest first

                if (error) throw error;

                const now = new Date();
                const available: PromoCode[] = [];
                const used: PromoCode[] = [];

                data?.forEach((promo: PromoCode) => {
                    const isExpired = promo.expires_at ? new Date(promo.expires_at) < now : false;
                    const isActive = promo.is_active;
                    // Check usage limit if applicable
                    const isUsedUp = promo.usage_limit && promo.times_used >= promo.usage_limit;

                    if (isActive && !isExpired && !isUsedUp) {
                        available.push(promo);
                    } else {
                        used.push(promo);
                    }
                });

                setPromos({ available, used });
            } catch (error) {
                console.error("Error fetching promo codes:", error);
                // toast.error("Failed to load promo codes");
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();
    }, []);

    const currentPromos = activeTab === 'available' ? promos.available : promos.used;

    if (loading) {
        return (
            <section className="mb-10 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-amber-500">✨</span> Promo Codes
                </h2>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section className="mb-10 text-white">
            {/* Tabs */}
            <div className="flex text-sm mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('available')}
                    className={`pb-3 mr-8 font-semibold transition-all duration-300 relative ${activeTab === 'available' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Available
                    {activeTab === 'available' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('used')}
                    className={`pb-3 mr-8 font-semibold transition-all duration-300 relative ${activeTab === 'used' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Used / Expired
                    {activeTab === 'used' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Scrollable Container */}
            <div className="h-[480px] overflow-y-auto p-1 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {currentPromos.length > 0 ? (
                    currentPromos.map((promo, index) => (
                        <div
                            key={promo.id || promo.code}
                            className="animate-in slide-in-from-bottom-2 fade-in duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <PromoCard
                                code={promo.code}
                                description={promo.description || `Get ${promo.discount_value}${promo.discount_type === 'percentage' ? '%' : ' LE'} off`}
                                expiry={promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Never'}
                                status={activeTab === 'available' ? 'available' : 'used'}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 animate-in fade-in duration-300">
                        <p>No promo codes found.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
