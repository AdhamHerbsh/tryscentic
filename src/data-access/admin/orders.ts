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
        variant:product_variants!variant_id(*)
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
        variant:product_variants!variant_id(
          *,
          product:products!product_id(*)
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
        variant:product_variants!variant_id(*)
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

  // If cancelling order, restore inventory (since stock is deducted at creation)
  if (validatedInput.status === "cancelled" && previousStatus !== "cancelled") {
    const items = order.items as any[];

    for (const item of items) {
      // Fetch current stock
      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock_quantity")
        .eq("id", item.variant_id)
        .single();

      if (variant) {
        const newStock = variant.stock_quantity + item.quantity;

        const { error: stockError } = await supabase
          .from("product_variants")
          .update({ stock_quantity: newStock })
          .eq("id", item.variant_id);

        if (stockError) {
          console.error(
            `Failed to restore stock for variant ${item.variant_id}: ${stockError.message}`
          );
        }
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

/**
 * Get pending orders for payment verification
 */
export async function getPendingOrders() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      user:profiles(full_name, email),
      items:order_items(
        quantity,
        unit_price_at_purchase,
        variant:product_variants(
          size_label,
          product:products(title)
        )
      )
    `
    )
    .eq("payment_status", "awaiting_verification")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending orders:", error);
    return [];
  }

  // Generate signed URLs for proofs
  const ordersWithProof = await Promise.all(
    data.map(async (order) => {
      let proof_url = order.proof_url;
      if (proof_url && !proof_url.startsWith("http")) {
        const { data: signed } = await supabase.storage
          .from("transaction_receipts")
          .createSignedUrl(proof_url, 3600);
        proof_url = signed?.signedUrl || null;
      }

      const user = Array.isArray(order.user) ? order.user[0] : order.user;

      return { ...order, proof_url, user };
    })
  );

  return ordersWithProof;
}

/**
 * Verify manual payment order
 */
export async function verifyOrder(
  orderId: string,
  action: "approve" | "reject",
  adminNote?: string
) {
  const { supabase } = await verifyAdmin();

  if (action === "approve") {
    // Approve: Set payment_status='paid', status='pending' (processing)
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "pending",
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", orderId);

    if (error) throw new Error(error.message);
  } else {
    // Reject: Set payment_status='failed', status='cancelled'
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "failed",
        status: "cancelled",
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", orderId);

    if (error) throw new Error(error.message);

    // Restore stock since order is cancelled
    const { data: items } = await supabase
      .from("order_items")
      .select("variant_id, quantity")
      .eq("order_id", orderId);

    if (items) {
      for (const item of items) {
        // Fetch current stock first to ensure accuracy
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock_quantity")
          .eq("id", item.variant_id)
          .single();

        if (variant) {
          const newStock = variant.stock_quantity + item.quantity;

          const { error: stockError } = await supabase
            .from("product_variants")
            .update({ stock_quantity: newStock })
            .eq("id", item.variant_id);

          if (stockError) {
            console.error(
              `Failed to restore stock for variant ${item.variant_id}: ${stockError.message}`
            );
          }
        }
      }
    }
  }

  revalidateAdminPaths();
  return { success: true };
}

/**
 * Get active orders for tracking management
 */
export async function getActiveOrders() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      user:profiles(full_name, email),
      items:order_items(
        quantity,
        unit_price_at_purchase,
        variant:product_variants(
          size_label,
          product:products(title)
        )
      )
    `
    )
    .neq("payment_status", "awaiting_verification")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }

  // Generate signed URLs for proofs (admin might want to see them even after approval)
  const ordersWithProof = await Promise.all(
    data.map(async (order) => {
      let proof_url = order.proof_url;
      if (proof_url && !proof_url.startsWith("http")) {
        const { data: signed } = await supabase.storage
          .from("transaction_receipts")
          .createSignedUrl(proof_url, 3600);
        proof_url = signed?.signedUrl || null;
      }

      const user = Array.isArray(order.user) ? order.user[0] : order.user;

      return { ...order, proof_url, user };
    })
  );

  return ordersWithProof;
}
