import { getUserOrders } from "@/data-access/orders";
import { Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function OrdersPage() {
    const orders = await getUserOrders();

    const getStatusStep = (status: string, paymentStatus: string) => {
        if (paymentStatus === 'unpaid' || paymentStatus === 'failed') return 0;
        if (paymentStatus === 'awaiting_verification') return 0.5; // Special state
        if (status === 'pending') return 1;
        if (status === 'shipped') return 2;
        if (status === 'delivered') return 3;
        return 0;
    };

    const StatusBadge = ({ status, paymentStatus }: { status: string, paymentStatus: string }) => {
        if (status === 'cancelled') return <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">Cancelled</span>;
        if (paymentStatus === 'awaiting_verification') return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20 flex items-center gap-1"><Clock size={12} /> Verifying Payment</span>;
        if (paymentStatus === 'unpaid') return <span className="bg-gray-500/10 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-500/20">Unpaid</span>;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize flex items-center gap-1
                ${status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                }`}>
                {status === 'pending' ? <><Package size={12} /> Preparing</> : status === 'shipped' ? <><Truck size={12} /> Shipped</> : <><CheckCircle size={12} /> Delivered</>}
            </span>
        );
    };

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <header className="flex items-end justify-between border-b border-white/10 py-6 mb-3">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-serif">My Orders</h1>
                        <p className="text-gray-400 mt-2">Track your past and current orders</p>
                    </div>
                    <div className="hidden md:block">
                        {/* Stats or filter could go here */}
                    </div>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                        <Package size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">Start exploring our collection of premium fragrances.</p>
                        <Link href="/pages/shop" className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => {
                            const currentStep = getStatusStep(order.status, order.payment_status);

                            return (
                                <div key={order.id} className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-colors">
                                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/2">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <p className="font-mono text-white font-medium">#{order.id.slice(0, 8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-bold text-secondary text-lg">LE {order.total_amount}</p>
                                        </div>
                                        <div>
                                            <StatusBadge status={order.status} paymentStatus={order.payment_status} />
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Progress Bar (Only for valid active orders) */}
                                        {order.status !== 'cancelled' && order.payment_status !== 'failed' && (
                                            <div className="mb-8 relative">
                                                <div className="h-1 bg-white/10 rounded-full w-full absolute top-1/2 -translate-y-1/2"></div>
                                                <div
                                                    className="h-1 bg-secondary rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                                                    style={{ width: `${(Math.max(0, currentStep) / 3) * 100}%` }}
                                                ></div>
                                                <div className="relative flex justify-between text-xs font-medium text-gray-400">
                                                    {['Placed', 'Preparing', 'Shipped', 'Delivered'].map((step, idx) => {
                                                        const isCompleted = currentStep >= idx;
                                                        return (
                                                            <div key={step} className={`flex flex-col items-center gap-2 ${isCompleted ? 'text-secondary' : ''}`}>
                                                                <div className={`w-3 h-3 rounded-full border-2 ${isCompleted ? 'bg-secondary border-secondary' : 'bg-gray-900 border-white/20'} z-10 transition-colors`} />
                                                                <span>{step}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Items Review */}
                                        <div className="space-y-4">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex gap-4 items-center bg-white/2 p-3 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all group">
                                                    <div className="relative w-16 h-16 bg-white/10 rounded-lg shrink-0 overflow-hidden">
                                                        {item.variant?.product?.base_image_url ? (
                                                            <Image
                                                                src={item.variant.product.base_image_url}
                                                                alt={item.variant.product.title || "Product Image"}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xl">✨</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">{item.variant?.product?.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400 border border-white/5">
                                                                {item.variant?.size_label}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-white">LE {(item.quantity * item.unit_price_at_purchase).toFixed(2)}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">LE {item.unit_price_at_purchase.toFixed(2)} / unit</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {order.tracking_number && (
                                        <div className="px-6 py-4 bg-white/3 text-sm flex justify-between items-center text-gray-300 border-t border-white/5">
                                            <span className="flex items-center gap-2 text-amber-500/80 font-semibold uppercase tracking-widest text-[10px]">
                                                <Truck size={14} /> Tracking Number
                                            </span>
                                            <span className="font-mono text-white bg-white/5 px-3 py-1 rounded-md border border-white/10 select-all shadow-inner">
                                                {order.tracking_number}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
