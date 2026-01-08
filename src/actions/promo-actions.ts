"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function validatePromoCode(code: string, cartTotal: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { success: false, message: "Invalid or expired promo code" };
  }

  const now = new Date();
  if (data.expires_at && new Date(data.expires_at) < now) {
    return { success: false, message: "Promo code has expired" };
  }

  if (data.usage_limit && data.times_used >= data.usage_limit) {
    return { success: false, message: "Promo code usage limit reached" };
  }

  if (cartTotal < data.min_order_amount) {
    return {
      success: false,
      message: `Minimum order amount for this code is LE ${data.min_order_amount.toFixed(
        2
      )}`,
    };
  }

  let discount = 0;
  if (data.discount_type === "percentage") {
    discount = (cartTotal * data.discount_value) / 100;
  } else {
    discount = data.discount_value;
  }

  return {
    success: true,
    message: "Promo code applied successfully!",
    discount,
    code: data.code,
  };
}
