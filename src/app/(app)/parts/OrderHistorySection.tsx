import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader2 } from "lucide-react";
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
      <h2 className="text-xl font-semibold mb-4 text-white">Order History</h2>

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

          {orders.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-2 sm:grid-cols-5 px-4 py-4 text-sm text-white border-b border-white/5 items-center gap-y-2 hover:bg-white/5 transition-colors"
            >
              <div className="font-mono text-xs opacity-70 truncate pr-2" title={item.id}>
                {item.id.slice(0, 8)}...
              </div>
              <div className="hidden sm:block text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(
                    item.status || "pending"
                  )}`}
                >
                  {item.status || "Pending"}
                </span>
              </div>
              <div className="hidden sm:block font-semibold">
                LE {item.total_amount.toFixed(2)}
              </div>
              <div className="text-right col-span-2 sm:col-span-1">
                <button className="text-amber-500 font-semibold hover:text-amber-400 transition-colors text-xs uppercase tracking-wider">
                  View Details
                </button>
                {/* Mobile-only Date/Total */}
                <div className="sm:hidden text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString()} • LE {item.total_amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
