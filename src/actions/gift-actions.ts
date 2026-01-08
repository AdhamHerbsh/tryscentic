"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Purchase a gift card using wallet balance
 */
export async function purchaseGiftCard(
  amount: number,
  recipientEmail?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    // 1. Check wallet balance
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile)
      throw new Error("Could not fetch wallet balance");

    if (profile.wallet_balance < amount) {
      return { success: false, message: "Insufficient wallet balance" };
    }

    // Generate a unique code
    const code =
      "GIFT-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 2. Transact: Deduct balance and Create Gift Card
    // Using individual calls because RPC for purchase might be better but let's try this
    const { error: deductError } = await supabase
      .from("profiles")
      .update({ wallet_balance: profile.wallet_balance - amount })
      .eq("id", user.id);

    if (deductError) throw new Error("Failed to deduct wallet balance");

    // Record the purchase transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "purchase",
      amount: -amount,
      description: `Purchased Gift Card: ${code}`,
      status: "confirmed",
    });

    // Create the gift code
    const { data: giftCode, error: giftError } = await supabase
      .from("gift_codes")
      .insert({
        code,
        amount,
        created_by: user.id,
        recipient_email: recipientEmail || null,
        status: "active",
        is_active: true,
      })
      .select()
      .single();

    if (giftError) throw new Error("Failed to create gift card records");

    revalidatePath("/pages/account");
    revalidatePath("/pages/account/wallet");

    return {
      success: true,
      message: "Gift card purchased successfully!",
      code,
    };
  } catch (error: any) {
    console.error("Gift card purchase error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Get gifts created by the user
 */
export async function getMyGifts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("gift_codes")
    .select(
      `
      *,
      redeemer:profiles!gift_codes_redeemed_by_fkey(full_name, email)
    `
    )
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my gifts:", error);
    return [];
  }

  return data;
}
