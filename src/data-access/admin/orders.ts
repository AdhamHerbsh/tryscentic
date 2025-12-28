"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import type { Order, OrderStatus } from "@/types/database";
import { updateOrderStatusSchema } from "@/lib/validation/admin-schemas";

/**
 * Get all orders with filtering
 */
export async function getOrders(params?: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { supabase } = await verifyAdmin();

  const { status, search = "", page = 1, limit = 20 } = params || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("orders").select(
    `
      *,
      user:profiles(*),
      items:order_items(
        *,
        variant:product_variants(*)
      )
    `,
    { count: "exact" }
  );

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`id.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return {
    orders: data as Order[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Get order details
 */
export async function getOrderDetails(orderId: string) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      user:profiles(*),
      items:order_items(
        *,
        variant:product_variants(
          *,
          product:products(*)
        )
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data as Order;
}

/**
 * Update order status with inventory management
 */
export async function updateOrderStatus(input: {
  order_id: string;
  status: OrderStatus;
}) {
  const { supabase } = await verifyAdmin();

  const validatedInput = updateOrderStatusSchema.parse(input);

  // Get current order with items
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        variant:product_variants(*)
      )
    `
    )
    .eq("id", validatedInput.order_id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch order: ${fetchError.message}`);
  }

  const previousStatus = order.status;

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: validatedInput.status })
    .eq("id", validatedInput.order_id);

  if (updateError) {
    throw new Error(`Failed to update order: ${updateError.message}`);
  }

  // If confirming order (moving from pending to shipped), deduct inventory
  if (previousStatus === "pending" && validatedInput.status === "shipped") {
    const items = order.items as any[];

    for (const item of items) {
      const currentStock = item.variant?.stock_quantity || 0;
      const newStock = currentStock - item.quantity;

      if (newStock < 0) {
        throw new Error(`Insufficient stock for variant ${item.variant_id}`);
      }

      const { error: stockError } = await supabase
        .from("product_variants")
        .update({ stock_quantity: newStock })
        .eq("id", item.variant_id);

      if (stockError) {
        throw new Error(`Failed to update stock: ${stockError.message}`);
      }
    }
  }

  // If cancelling order that was already shipped, restore inventory
  if (previousStatus === "shipped" && validatedInput.status === "cancelled") {
    const items = order.items as any[];

    for (const item of items) {
      const currentStock = item.variant?.stock_quantity || 0;
      const newStock = currentStock + item.quantity;

      const { error: stockError } = await supabase
        .from("product_variants")
        .update({ stock_quantity: newStock })
        .eq("id", item.variant_id);

      if (stockError) {
        console.error(`Failed to restore stock: ${stockError.message}`);
      }
    }
  }

  revalidateAdminPaths();

  return { success: true, previousStatus, newStatus: validatedInput.status };
}

/**
 * Get order statistics
 */
export async function getOrderStats() {
  const { supabase } = await verifyAdmin();

  const [totalResult, pendingResult, revenueResult] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("orders").select("total_amount").eq("status", "delivered"),
  ]);

  const totalRevenue =
    revenueResult.data?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;

  return {
    totalOrders: totalResult.count || 0,
    pendingOrders: pendingResult.count || 0,
    totalRevenue,
  };
}
