"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface OrderItem {
  variant_id: string;
  quantity: number;
  unit_price: number;
}

interface CreateOrderInput {
  total_amount: number;
  shipping_info: any;
  shipping_method: "express" | "standard" | "custom";
  payment_method: "wallet" | "vodafone_cash" | "instapay" | "cod";
  items: OrderItem[];
  proof_file?: File;
  scheduled_delivery_date?: string | null;
  promo_code?: string | null;
  wallet_deduction?: number;
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    let proof_url = null;

    // Handle File Upload if Manual Payment
    if (
      input.payment_method === "vodafone_cash" ||
      input.payment_method === "instapay"
    ) {
      if (!input.proof_file) {
        return { success: false, message: "Proof of payment is required" };
      }

      const fileExt = input.proof_file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_order.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("transaction_receipts")
        .upload(fileName, input.proof_file);

      if (uploadError)
        throw new Error("Failed to upload proof: " + uploadError.message);
      proof_url = fileName;
    }

    // Call RPC
    const { data: orderId, error: rpcError } = await supabase.rpc(
      "place_order",
      {
        p_user_id: user.id,
        p_total_amount: input.total_amount,
        p_shipping_info: input.shipping_info,
        p_shipping_method: input.shipping_method,
        p_payment_method: input.payment_method,
        p_items: input.items,
        p_proof_url: proof_url,
        p_scheduled_delivery_date: input.scheduled_delivery_date || null,
        p_promo_code: input.promo_code || null,
        p_wallet_deduction: input.wallet_deduction || 0,
      }
    );

    if (rpcError) throw new Error(rpcError.message);

    revalidatePath("/pages/account/orders");
    return { success: true, orderId };
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return { success: false, message: error.message };
  }
}

export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        variant:product_variants(
          product:products(title, base_image_url),
          size_label
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data;
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        variant:product_variants(
          product:products(title, base_image_url, description),
          size_label
        )
      )
    `
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data;
}
