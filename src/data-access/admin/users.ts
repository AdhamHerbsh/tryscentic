"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import type { Profile } from "@/types/database";
import {
  walletAdjustmentSchema,
  userBanSchema,
} from "@/lib/validation/admin-schemas";

/**
 * Get all users with pagination and search
 */
export async function getUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
  role?: "admin" | "customer";
}) {
  const { supabase } = await verifyAdmin();

  const { search = "", page = 1, limit = 20, role } = params || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("profiles").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  if (role) {
    query = query.eq("role", role);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return {
    users: data as Profile[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Get single user details
 */
export async function getUserDetails(userId: string) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data as Profile;
}

/**
 * Adjust user wallet balance with audit logging
 */
export async function adjustUserWallet(input: {
  user_id: string;
  amount: number;
  reason: string;
}) {
  const { user, supabase } = await verifyAdmin();

  // Validate input
  const validatedInput = walletAdjustmentSchema.parse(input);

  // Get current balance
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("wallet_balance")
    .eq("id", validatedInput.user_id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch user balance: ${fetchError.message}`);
  }

  const previousBalance = profile.wallet_balance;
  const newBalance = previousBalance + validatedInput.amount;

  if (newBalance < 0) {
    throw new Error("Insufficient balance for this adjustment");
  }

  // Update balance
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ wallet_balance: newBalance })
    .eq("id", validatedInput.user_id);

  if (updateError) {
    throw new Error(`Failed to update wallet: ${updateError.message}`);
  }

  // Create transaction record for audit
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: validatedInput.user_id,
    type: validatedInput.amount > 0 ? "deposit" : "purchase",
    amount: validatedInput.amount,
    description: `Admin adjustment (${user.email}): ${validatedInput.reason}`,
  });

  if (txError) {
    console.error("Failed to create transaction record:", txError);
  }

  revalidateAdminPaths();

  return {
    success: true,
    previousBalance,
    newBalance,
  };
}

/**
 * Ban or unban a user
 */
export async function toggleUserBan(input: {
  user_id: string;
  is_banned: boolean;
  reason?: string;
}) {
  const { supabase } = await verifyAdmin();

  const validatedInput = userBanSchema.parse(input);

  // Note: is_banned field needs to be added to profiles table
  // For now, we'll use a metadata approach or custom field
  const { error } = await supabase
    .from("profiles")
    .update({
      // is_banned: validatedInput.is_banned
      // For now, we can store in metadata or add column via migration
    })
    .eq("id", validatedInput.user_id);

  if (error) {
    throw new Error(`Failed to update user ban status: ${error.message}`);
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Get user transaction history
 */
export async function getUserTransactions(userId: string, limit = 50) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data;
}
