import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader2, ChevronDown, ChevronUp, Package, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  product_name_snapshot: string;
  quantity: number;
  unit_price_at_purchase: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items?: OrderItem[]; // Joined
}

export default function OrderHistorySection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-700/50 text-green-300";
      case "shipped":
        return "bg-blue-700/50 text-blue-300";
      case "cancelled":
        return "bg-red-700/50 text-red-300";
      default:
        return "bg-yellow-700/50 text-yellow-300"; // pending/processing
    }
  };

  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Order History</h2>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-10">
      <div className="flex justify-between py-2">
        <h2 className="text-xl font-semibold mb-4 text-white">Order History</h2>
        <Link href="/pages/account/orders" className="bg-secondary rounded-lg px-4 py-2 text-white font-semibold hover:bg-secondary/80 transition-colors">
          Track Orders
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 bg-white/5 rounded-3xl border border-white/10 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">You have no orders yet</h3>
          <p className="text-gray-400">
            Looks like you haven&apos;t placed an order yet.
          </p>
          <Link href="/pages/shop" className="inline-block mt-4 text-amber-500 hover:text-amber-400 font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Header */}
          <div
            className="grid grid-cols-2 sm:grid-cols-5 px-4 py-3 text-gray-300 text-sm font-semibold gap-y-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderBottom: "1px solid #F0A020",
            }}
          >
            <div className="sm:col-span-1">Order ID</div>
            <div className="hidden sm:block">Date</div>
            <div>Status</div>
            <div className="hidden sm:block">Total</div>
            <div className="text-right sm:col-span-1">Action</div>
          </div>

          {orders.map((item: Order) => (
            <div key={item.id} className="border-b border-white/5 last:border-0">
              <div
                className={`grid grid-cols-2 sm:grid-cols-5 px-4 py-4 text-sm text-white items-center gap-y-2 hover:bg-white/5 transition-colors cursor-pointer ${expandedOrderId === item.id ? "bg-white/5" : ""
                  }`}
                onClick={() => setExpandedOrderId(expandedOrderId === item.id ? null : item.id)}
              >
                <div className="font-mono text-xs opacity-70 truncate pr-2" title={item.id}>
                  {item.id.slice(0, 8)}...
                </div>
                <div className="hidden sm:block text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                      item.status || "pending"
                    )}`}
                  >
                    {item.status || "Pending"}
                  </span>
                </div>
                <div className="hidden sm:block font-semibold">
                  LE {item.total_amount.toFixed(2)}
                </div>
                <div className="text-right col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
                  <button
                    className="text-amber-500 font-semibold hover:text-amber-400 transition-colors text-xs uppercase tracking-wider flex items-center gap-1"
                  >
                    {expandedOrderId === item.id ? "Close" : "View Details"}
                    {expandedOrderId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {/* Mobile-only Date/Total */}
                  <div className="sm:hidden text-[10px] text-gray-200 mt-1 block">
                    {new Date(item.created_at).toLocaleDateString()} • LE {item.total_amount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === item.id && (
                <div className="px-4 py-6 bg-white/2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Info Summary */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500/80 mb-3 flex items-center gap-2">
                        <Package size={14} /> Order Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-100">
                          <Calendar size={14} className="text-gray-200" />
                          <div>
                            <p className="text-[10px] uppercase tracking-tighter text-gray-200">Ordered On</p>
                            <p className="text-sm text-gray-200">{new Date(item.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-100">
                          <CreditCard size={14} className="text-gray-200" />
                          <div>
                            <p className="text-[10px] uppercase tracking-tighter text-gray-200">Total Paid</p>
                            <p className="text-sm font-bold text-white">LE {item.total_amount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500/80 mb-4 flex items-center gap-2">
                        <ShoppingBag size={14} /> Order Items
                      </h4>
                      <div className="space-y-3">
                        {item.items && item.items.length > 0 ? (
                          item.items.map((orderItem: OrderItem) => (
                            <div key={orderItem.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/5 group hover:border-amber-500/30 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-lg">
                                  ✨
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                                    {orderItem.product_name_snapshot}
                                  </p>
                                  <p className="text-xs text-gray-100 italic">
                                    Qty: {orderItem.quantity} units
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-white">
                                  LE {(orderItem.quantity * orderItem.unit_price_at_purchase).toFixed(2)}
                                </p>
                                <p className="text-[10px] text-gray-200 uppercase tracking-tighter">
                                  LE {orderItem.unit_price_at_purchase.toFixed(2)} / unit
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-200 italic">No item details available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
