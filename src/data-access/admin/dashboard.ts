"use server";

import { verifyAdmin } from "./auth";
import type { DashboardStats } from "@/types/database";

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase } = await verifyAdmin();

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();

  // Start of week (Sunday)
  const d = new Date(now);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const startOfWeek = new Date(d.setDate(diff)).toISOString();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  // Get all stats in parallel
  const [
    orders,
    profiles,
    products,
    variants,
    transactions,
    promoCodes,
    giftCodes,
    reviews,
    brands,
    categories,
  ] = await Promise.all([
    supabase.from("orders").select("total_amount, status, created_at"),
    supabase
      .from("profiles")
      .select("wallet_balance, is_banned, role, created_at"),
    supabase.from("products").select("is_active"),
    supabase.from("product_variants").select("stock_quantity"),
    supabase.from("transactions").select("amount, type, status"),
    supabase.from("promo_codes").select("is_active, expires_at"),
    supabase.from("gift_codes").select("is_active"),
    supabase.from("reviews").select("rating"),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  const orderData = orders.data || [];
  const profileData = profiles.data || [];
  const productData = products.data || [];
  const variantData = variants.data || [];
  const transactionData = transactions.data || [];
  const promoData = promoCodes.data || [];
  const giftData = giftCodes.data || [];
  const reviewData = reviews.data || [];

  // 1. Revenue & Orders
  const totalRevenue = orderData
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const todayOrders = orderData.filter((o) => o.created_at >= startOfToday);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const weekRevenue = orderData
    .filter((o) => o.created_at >= startOfWeek && o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const monthRevenue = orderData
    .filter((o) => o.created_at >= startOfMonth && o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  // 2. Users
  const customerProfiles = profileData.filter((p) => p.role === "customer");
  const totalUsers = customerProfiles.length;
  const bannedUsers = customerProfiles.filter((p) => p.is_banned).length;
  const activeUsers = totalUsers - bannedUsers;
  const newUsersToday = customerProfiles.filter(
    (p) => p.created_at >= startOfToday
  ).length;
  const newUsersWeek = customerProfiles.filter(
    (p) => p.created_at >= startOfWeek
  ).length;

  // 3. Products
  const totalProducts = productData.length;
  const activeProducts = productData.filter((p) => p.is_active).length;
  const inactiveProducts = totalProducts - activeProducts;
  const lowStockProducts = variantData.filter(
    (v) => v.stock_quantity > 0 && v.stock_quantity < 10
  ).length;
  const outOfStockProducts = variantData.filter(
    (v) => v.stock_quantity === 0
  ).length;
  const totalVariants = variantData.length;

  // 4. Transactions
  const pendingTransactions = transactionData.filter(
    (t) => t.status === "pending"
  ).length;
  const confirmedTransactions = transactionData.filter(
    (t) => t.status === "confirmed"
  ).length;
  const rejectedTransactions = transactionData.filter(
    (t) => t.status === "rejected"
  ).length;
  const totalWalletBalance = profileData.reduce(
    (sum, p) => sum + Number(p.wallet_balance),
    0
  );
  const pendingDeposits = transactionData
    .filter((t) => t.status === "pending" && t.type === "deposit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 5. Promo/Gift
  const totalPromoCodes = promoData.length;
  const activePromoCodes = promoData.filter(
    (p) => p.is_active && (!p.expires_at || new Date(p.expires_at) > now)
  ).length;
  const activeGiftCodes = giftData.filter((g) => g.is_active).length;
  const usedGiftCodes = giftData.length - activeGiftCodes;

  // 6. Reviews
  const totalReviews = reviewData.length;
  const avgRating =
    totalReviews > 0
      ? reviewData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    totalRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    totalOrders: orderData.length,
    pendingOrders: orderData.filter((o) => o.status === "pending").length,
    shippedOrders: orderData.filter((o) => o.status === "shipped").length,
    deliveredOrders: orderData.filter((o) => o.status === "delivered").length,
    cancelledOrders: orderData.filter((o) => o.status === "cancelled").length,
    todayOrders: todayOrders.length,

    totalUsers,
    activeUsers,
    bannedUsers,
    newUsersToday,
    newUsersWeek,

    totalProducts,
    activeProducts,
    inactiveProducts,
    lowStockProducts,
    outOfStockProducts,
    totalVariants,

    pendingTransactions,
    confirmedTransactions,
    rejectedTransactions,
    totalWalletBalance,
    pendingDeposits,

    activePromoCodes,
    totalPromoCodes,
    activeGiftCodes,
    usedGiftCodes,

    totalReviews,
    avgRating,

    totalBrands: brands.count || 0,
    totalCategories: categories.count || 0,
  };
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit = 10) {
  const { supabase } = await verifyAdmin();

  // Fetch from multiple sources
  const [orders, transactions, reviews, users] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total_amount, created_at, user:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("transactions")
      .select("id, status, amount, type, created_at, user:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("reviews")
      .select(
        "id, rating, created_at, user:profiles(full_name), product:products(title)"
      )
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("profiles")
      .select("id, full_name, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const activities: any[] = [];

  if (orders.data) {
    (orders.data as any[]).forEach((o) =>
      activities.push({
        id: o.id,
        type: "order",
        description: `New order by ${o.user?.full_name || "Guest"}`,
        timestamp: new Date(o.created_at),
        status: o.status,
        amount: o.total_amount,
      })
    );
  }

  if (transactions.data) {
    (transactions.data as any[]).forEach((t) =>
      activities.push({
        id: t.id,
        type: "transaction",
        description: `${t.type.toUpperCase()} request from ${
          t.user?.full_name || "User"
        }`,
        timestamp: new Date(t.created_at),
        status: t.status,
        amount: t.amount,
      })
    );
  }

  if (reviews.data) {
    (reviews.data as any[]).forEach((r) =>
      activities.push({
        id: r.id,
        type: "review",
        description: `${r.rating}-star review on ${
          r.product?.title || "Product"
        } by ${r.user?.full_name || "User"}`,
        timestamp: new Date(r.created_at),
      })
    );
  }

  if (users.data) {
    users.data.forEach((u) =>
      activities.push({
        id: u.id,
        type: "user",
        description: `New user registration: ${u.full_name}`,
        timestamp: new Date(u.created_at),
      })
    );
  }

  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Get top selling products
 */
export async function getTopProducts(limit = 5) {
  const { supabase } = await verifyAdmin();

  // Get order items joined with variant and product
  const { data, error } = await supabase.from("order_items").select(`
      variant_id,
      quantity,
      unit_price_at_purchase,
      variant:product_variants!variant_id(
        product:products!product_id(id, title)
      )
    `);

  if (error) throw error;

  const productStats: Record<
    string,
    { id: string; name: string; sales: number; revenue: number }
  > = {};

  (data as any[]).forEach((item) => {
    const product = item.variant?.product;
    if (!product) return;

    if (!productStats[product.id]) {
      productStats[product.id] = {
        id: product.id,
        name: product.title,
        sales: 0,
        revenue: 0,
      };
    }

    productStats[product.id].sales += item.quantity;
    productStats[product.id].revenue +=
      item.quantity * Number(item.unit_price_at_purchase);
  });

  return Object.values(productStats)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
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
    .neq("status", "cancelled");

  if (error) throw error;

  const revenueByDate: Record<
    string,
    { date: string; revenue: number; orders: number }
  > = {};

  data.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    if (!revenueByDate[date]) {
      revenueByDate[date] = { date, revenue: 0, orders: 0 };
    }
    revenueByDate[date].revenue += Number(order.total_amount);
    revenueByDate[date].orders += 1;
  });

  return Object.values(revenueByDate).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
