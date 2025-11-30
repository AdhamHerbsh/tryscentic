"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// نوع الطلب
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;            // رقم الطلب
  date: string;          // تاريخ الطلب
  status: "Delivered" | "Processing" | "Canceled";
  total: number;         // الإجمالي النهائي
  items: OrderItem[];    // المنتجات داخل الطلب
}

// نوع الكونتكست
interface OrderContextType {
  orders: Order[];
  addOrder: (items: OrderItem[]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // إضافة طلب جديد — بيتاخد من الكارت بعد الـ checkout
  const addOrder = (items: OrderItem[]) => {
    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(), // رقم طلب عشوائي
      date: new Date().toLocaleDateString(), // التاريخ الحالي
      status: "Processing", // أول حالة للطلب
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      items,
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return ctx;
}
