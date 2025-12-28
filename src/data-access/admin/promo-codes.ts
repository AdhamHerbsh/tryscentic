"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import type { PromoCode } from "@/types/database";
import { createPromoCodeSchema } from "@/lib/validation/admin-schemas";

/**
 * Get all promo codes
 */
export async function getPromoCodes(params?: {
  is_active?: boolean;
  page?: number;
  limit?: number;
}) {
  const { supabase } = await verifyAdmin();

  const { is_active, page = 1, limit = 20 } = params || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("promo_codes").select("*", { count: "exact" });

  if (is_active !== undefined) {
    query = query.eq("is_active", is_active);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch promo codes: ${error.message}`);
  }

  return {
    promoCodes: data as PromoCode[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Create promo code
 */
export async function createPromoCode(input: {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  usage_limit?: number | null;
  expires_at?: string | null;
}) {
  const { supabase } = await verifyAdmin();

  const validatedInput = createPromoCodeSchema.parse(input);

  const { data, error } = await supabase
    .from("promo_codes")
    .insert({
      ...validatedInput,
      is_active: true,
      times_used: 0,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Promo code already exists");
    }
    throw new Error(`Failed to create promo code: ${error.message}`);
  }

  revalidateAdminPaths();

  return data;
}

/**
 * Toggle promo code active status
 */
export async function togglePromoCode(promoCodeId: string, is_active: boolean) {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active })
    .eq("id", promoCodeId);

  if (error) {
    throw new Error(`Failed to update promo code: ${error.message}`);
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Delete promo code
 */
export async function deletePromoCode(promoCodeId: string) {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", promoCodeId);

  if (error) {
    throw new Error(`Failed to delete promo code: ${error.message}`);
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Update promo code
 */
export async function updatePromoCode(
  promoCodeId: string,
  updates: Partial<Omit<PromoCode, "id" | "created_at" | "times_used">>
) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("promo_codes")
    .update(updates)
    .eq("id", promoCodeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update promo code: ${error.message}`);
  }

  revalidateAdminPaths();

  return data;
}
