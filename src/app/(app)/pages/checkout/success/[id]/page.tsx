import { getOrderById } from "@/data-access/orders";
import { CheckCircle, Package, Calendar, CreditCard, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import SuccessAnimations from "@/components/ui/SuccessAnimations";

interface SuccessPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ status?: string }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
    const { id } = await params;
    const { status } = await searchParams;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const isPending = status === "pending" || order.payment_status === "awaiting_verification";

    return (
        <div className="min-h-screen bg-primary pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Gold Mist Luxury Animation */}
            <SuccessAnimations />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Animated Success Header */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative bg-secondary text-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(240,160,32,0.4)] border-4 border-primary">
                            <CheckCircle size={40} className="animate-in zoom-in duration-700" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
                        {isPending ? "Order Received" : "The Scent of Success"}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        {isPending
                            ? "We've received your payment proof. Our specialists are verifying it now."
                            : "Your Grand Edition journey begins. Your order is confirmed and being prepared."}
                    </p>
                </div>

                {/* Digital Receipt / Luxury Summary Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-10 group">
                    {/* Background Texture Effect */}
                    <div className="absolute inset-0 bg-[url('/textures/fine-paper.png')] opacity-5 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-secondary/20 transition-all duration-700" />

                    <div className="relative p-8 md:p-12">
                        <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2">Registration ID</p>
                                <h2 className="text-2xl font-mono text-white tracking-tighter">#{order.id.slice(0, 12)}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2">Issue Date</p>
                                <p className="text-white font-serif">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 mb-10">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <Package size={18} className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary/60 uppercase tracking-widest font-bold mb-1">Shipping Designation</p>
                                        <p className="text-white text-sm leading-relaxed">
                                            {order.shipping_info.fullName}<br />
                                            {order.shipping_info.address}<br />
                                            {order.shipping_info.city}, {order.shipping_info.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <ShoppingBag size={18} className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary/60 uppercase tracking-widest font-bold mb-1">Composition</p>
                                        <div className="space-y-2">
                                            {order.items?.map((item: any) => (
                                                <p key={item.id} className="text-white text-sm">
                                                    {item.variant.product.title} <span className="text-secondary/60 ml-1">× {item.quantity}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <CreditCard size={18} className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary/60 uppercase tracking-widest font-bold mb-1">Financial Value</p>
                                        <p className="text-2xl font-bold text-white">LE {order.total_amount.toFixed(2)}</p>
                                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Paid via {order.payment_method.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/10">
                                    <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-2">Next Steps</p>
                                    <p className="text-xs text-gray-400 leading-relaxed italic">
                                        {isPending
                                            ? "A specialist is assigned to verify your payment. Expect a confirmation within 1-2 hours."
                                            : "Your fragrances are currently being curated and packaged with the utmost care."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Tryscentic • Grand Edition Collection</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/pages/account/orders"
                        className="px-8 py-4 bg-secondary text-primary font-bold rounded-xl hover:shadow-[0_0_20px_rgba(240,160,32,0.3)] transition-all text-center flex items-center justify-center gap-2"
                    >
                        Track in Dashboard <ChevronRight size={18} />
                    </Link>
                    <Link
                        href="/pages/shop"
                        className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center border border-white/10"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
