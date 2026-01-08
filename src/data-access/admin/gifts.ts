"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import { createClient } from "@/lib/utils/supabase/server";

/**
 * Get all gift codes with creator and redeemer info
 */
export async function getAllGifts() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("gift_codes")
    .select(
      `
      *,
      creator:profiles!gift_codes_created_by_fkey(full_name, email),
      redeemer:profiles!gift_codes_redeemed_by_fkey(full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch gift codes: ${error.message}`);
  }

  return data;
}

/**
 * Admin creates a gift for a specific user (by email)
 * This doesn't deduct from any wallet, it's a "system gift"
 */
export async function adminSendGift(input: {
  amount: number;
  recipientEmail: string;
}) {
  const { supabase } = await verifyAdmin();

  const code =
    "ADMIN-GIFT-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const { data, error } = await supabase
    .from("gift_codes")
    .insert({
      code,
      amount: input.amount,
      recipient_email: input.recipientEmail,
      status: "active",
      is_active: true,
      // created_by will be null or we can set it to admin ID if we want
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create system gift: ${error.message}`);
  }

  revalidateAdminPaths();
  return data;
}
