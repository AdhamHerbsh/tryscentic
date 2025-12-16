"use client";

import { useOrders } from "@/lib/context/OrderContext";

export default function OrderHistorySection() {
  const { orders } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-700/50 text-green-300";
      case "processing":
        return "bg-yellow-700/50 text-yellow-300";
      default:
        return "bg-gray-600/50 text-gray-300";
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-white">Order History</h2>

      {orders.length === 0 ? (
        <div
          className="p-6 rounded-xl text-gray-300"
          style={{ backgroundColor: "rgba(255, 255, 223, 0.53)" }}
        >
          You have no orders yet.
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden border"
          style={{ borderColor: "#F0A020", backgroundColor: "#1A1C23" }}
        >
          <div
            className="grid grid-cols-5 px-4 py-3 text-gray-300 text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderBottom: "1px solid #F0A020",
            }}
          >
            <div>Order ID</div>
            <div>Date</div>
            <div>Status</div>
            <div>Total</div>
            <div className="text-right">Action</div>
          </div>

          {orders.map((item, index) => (
            <div
              key={item.id + index}
              className="grid grid-cols-5 px-4 py-4 text-sm text-white border-b border-white/10"
              style={{ backgroundColor: "#101117" }}
            >
              <div>#{index + 1}</div>
              <div>{item.date || "10/10/2023"}</div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status || "processing"
                  )}`}
                >
                  {item.status || "Processing"}
                </span>
              </div>

              <div>${(item.items.reduce((total, item) => total + item.price * item.quantity, 0)).toFixed(2)}</div>

              <div className="text-right">
                <button className="text-secondary font-semibold hover:underline">
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
