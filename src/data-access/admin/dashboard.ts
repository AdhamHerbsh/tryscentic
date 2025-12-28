"use server";

import { verifyAdmin } from "./auth";
import { getOrderStats } from "./orders";
import { getPendingTransactionsCount } from "./transactions";
import { getLowStockProducts } from "./products";
import type { DashboardStats } from "@/types/database";

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase } = await verifyAdmin();

  // Get all stats in parallel
  const [
    orderStats,
    usersCount,
    productsCount,
    lowStockProducts,
    pendingTransactions,
  ] = await Promise.all([
    getOrderStats(),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    getLowStockProducts(),
    getPendingTransactionsCount(),
  ]);

  return {
    totalRevenue: orderStats.totalRevenue,
    totalOrders: orderStats.totalOrders,
    pendingOrders: orderStats.pendingOrders,
    totalUsers: usersCount.count || 0,
    totalProducts: productsCount.count || 0,
    lowStockProducts: lowStockProducts.length,
    pendingTransactions,
  };
}

/**
 * Get recent activities (orders, transactions)
 */
export async function getRecentActivities(limit = 10) {
  const { supabase } = await verifyAdmin();

  const [orders, transactions] = await Promise.all([
    supabase
      .from("orders")
      .select("*, user:profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("transactions")
      .select("*, user:profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  return {
    recentOrders: orders.data || [],
    recentTransactions: transactions.data || [],
  };
}

/**
 * Get revenue analytics (last 30 days)
 */
export async function getRevenueAnalytics() {
  const { supabase } = await verifyAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount, status")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .eq("status", "delivered");

  if (error) {
    throw new Error(`Failed to fetch revenue analytics: ${error.message}`);
  }

  // Group by date
  const revenueByDate: Record<string, number> = {};

  data.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    revenueByDate[date] = (revenueByDate[date] || 0) + order.total_amount;
  });

  return Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
