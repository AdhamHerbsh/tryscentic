"use client";

import { getPendingOrders, verifyOrder, getActiveOrders, updateOrderStatus } from "@/data-access/admin/orders";
import { useEffect, useState } from "react";
import { Check, X, Eye, FileText, Calendar, Truck, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type Tab = 'pending' | 'active';

// Client Component to handle interactive verification & management
export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState<Tab>('pending');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        setSelectedOrder(null);
        try {
            if (activeTab === 'pending') {
                const data = await getPendingOrders();
                setOrders(data);
            } else {
                const data = await getActiveOrders();
                setOrders(data);
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleVerify = async (orderId: string, action: 'approve' | 'reject') => {
        try {
            await verifyOrder(orderId, action);
            toast.success(`Order ${action}d successfully`);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update order" + error);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus({ order_id: orderId, status: newStatus as any });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
            // Update local selected state to reflect change immediately if needed, or just re-fetch
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold bg-linear-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    {activeTab === 'pending' ? 'Payment Verification' : 'Order Management'}
                </h1>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FileText size={16} /> Verification Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'active' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingBag size={16} /> Active Orders
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden h-[800px] flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
                            {activeTab === 'pending' ? <FileText size={18} className="text-amber-500" /> : <Package size={18} className="text-secondary" />}
                            {activeTab === 'pending' ? 'Pending Approvals' : 'All Orders'} ({orders.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-white/5 overflow-y-auto flex-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-200">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-8 text-center text-gray-200">No orders found.</div>
                        ) : (
                            orders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-white/5 flex items-center justify-between group border-l-4 ${selectedOrder?.id === order.id ? 'bg-white/10 border-l-secondary' : 'border-l-transparent'}`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-white">#{order.id.slice(0, 8)}</p>
                                            {activeTab === 'active' && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{order.user?.email || order.shipping_info?.email || 'Unknown User'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded capitalize border border-white/5">
                                                {order.payment_method?.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={10} /> {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-white">LE {order.total_amount}</p>
                                        <button className="text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                                            View <Eye size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 min-h-[800px] h-fit">
                    {selectedOrder ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                                    <p className="text-gray-200 text-sm font-mono">ID: {selectedOrder.id}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded border capitalize ${getStatusColor(selectedOrder.status)}`}>
                                            Status: {selectedOrder.status}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded border capitalize ${selectedOrder.payment_status === 'paid' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-amber-400 border-amber-400/20 bg-amber-400/10'}`}>
                                            Payment: {selectedOrder.payment_status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions based on tab */}
                                <div className="flex gap-2">
                                    {activeTab === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleVerify(selectedOrder.id, 'reject')}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                                title="Reject Payment"
                                            >
                                                <X size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleVerify(selectedOrder.id, 'approve')}
                                                className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors border border-green-500/20"
                                                title="Approve Payment"
                                            >
                                                <Check size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Update Status</label>
                                            <select
                                                value={selectedOrder.status}
                                                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                                className="bg-black border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-secondary"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Customer Info</p>
                                    <p className="font-medium text-white">{selectedOrder.shipping_info?.fullName || selectedOrder.user?.full_name}</p>
                                    <p className="text-sm text-gray-400">{selectedOrder.shipping_info?.phone || 'No phone'}</p>
                                    <p className="text-xs text-gray-500 mt-1">{selectedOrder.shipping_info?.address}, {selectedOrder.shipping_info?.city}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Financials</p>
                                    <p className="font-bold text-2xl text-white">LE {selectedOrder.total_amount}</p>
                                    <p className="text-xs text-gray-400 mt-1 capitalize">Method: {selectedOrder.payment_method?.replace('_', ' ')}</p>
                                </div>
                            </div>

                            {/* Proof Image Section - Only if URL exists */}
                            {selectedOrder.proof_url && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-300">Payment Proof</p>
                                    <div className="relative aspect-video w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 group">
                                        <a href={selectedOrder.proof_url} target="_blank" rel="noopener noreferrer">
                                            <Image
                                                src={selectedOrder.proof_url}
                                                alt="Proof"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-contain hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white text-sm font-medium flex items-center gap-2">
                                                    <Eye size={16} /> View Full Size
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Items */}
                            <div>
                                <p className="text-sm font-semibold text-gray-300 mb-2">Order Items ({selectedOrder.items?.length})</p>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center">
                                                    {/* Ideally show product image here if available in variant->product relation */}
                                                    <Package size={16} className="text-black" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{item.variant?.product?.title}</p>
                                                    <p className="text-xs text-gray-500">{item.variant?.size_label} x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="text-white font-medium">LE {item.unit_price_at_purchase}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-200 opacity-50">
                            <ShoppingBag size={48} className="mb-4 text-white/80" />
                            <p>Select an order to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
