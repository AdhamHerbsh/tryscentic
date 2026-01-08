"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { createOrder as dalCreateOrder } from "@/data-access/orders";

export async function createOrder(formData: FormData) {
  const shipping_info = JSON.parse(formData.get("shipping_info") as string);
  const total_amount = parseFloat(formData.get("total_amount") as string);
  const items = JSON.parse(formData.get("items") as string);
  const payment_method = formData.get("payment_method") as any;
  const shipping_method = formData.get("shipping_method") as any;
  const scheduled_delivery_date = formData.get(
    "scheduled_delivery_date"
  ) as string;
  const proof_file = formData.get("proof_file") as File;
  const promo_code = formData.get("promo_code") as string;
  const wallet_deduction =
    parseFloat(formData.get("wallet_deduction") as string) || 0;

  const result = await dalCreateOrder({
    total_amount,
    shipping_info,
    shipping_method,
    payment_method,
    items,
    proof_file,
    scheduled_delivery_date,
    promo_code,
    wallet_deduction,
  });

  if (result.success) {
    revalidatePath("/pages/user-dashboard");
    revalidatePath("/pages/checkout");
  }

  return result;
}
