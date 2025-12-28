"use server";

import { verifyAdmin, revalidateAdminPaths, getAdminId } from "./auth";
import type { Transaction } from "@/types/database";
import { confirmTransactionSchema } from "@/lib/validation/admin-schemas";

/**
 * Get all transactions with filtering
 */
export async function getTransactions(params?: {
  status?: "pending" | "confirmed" | "rejected";
  type?: "deposit" | "purchase" | "refund";
  user_id?: string;
  page?: number;
  limit?: number;
}) {
  const { supabase } = await verifyAdmin();

  const { status, type, user_id, page = 1, limit = 20 } = params || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("transactions").select(
    `
      *,
      user:profiles(*)
    `,
    { count: "exact" }
  );

  if (status) {
    query = query.eq("status", status);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (user_id) {
    query = query.eq("user_id", user_id);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return {
    transactions: data as Transaction[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Confirm or reject a pending transaction
 * This updates user wallet balance for deposits
 */
export async function confirmTransaction(input: {
  transaction_id: string;
  action: "confirm" | "reject";
  admin_note?: string;
}) {
  const { supabase } = await verifyAdmin();
  const adminId = await getAdminId();

  const validatedInput = confirmTransactionSchema.parse(input);

  // Get transaction details
  const { data: transaction, error: fetchError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", validatedInput.transaction_id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch transaction: ${fetchError.message}`);
  }

  if (transaction.status && transaction.status !== "pending") {
    throw new Error("Transaction already processed");
  }

  const newStatus =
    validatedInput.action === "confirm" ? "confirmed" : "rejected";

  // Update transaction status
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      status: newStatus,
      // admin_note: validatedInput.admin_note // Add this field to schema if needed
    })
    .eq("id", validatedInput.transaction_id);

  if (updateError) {
    throw new Error(`Failed to update transaction: ${updateError.message}`);
  }

  // If confirming a deposit, update user wallet
  if (validatedInput.action === "confirm" && transaction.type === "deposit") {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", transaction.user_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    const newBalance = profile.wallet_balance + transaction.amount;

    const { error: balanceError } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance })
      .eq("id", transaction.user_id);

    if (balanceError) {
      throw new Error(
        `Failed to update wallet balance: ${balanceError.message}`
      );
    }
  }

  revalidateAdminPaths();

  return { success: true, status: newStatus };
}

/**
 * Get pending transactions count
 */
export async function getPendingTransactionsCount() {
  const { supabase } = await verifyAdmin();

  const { count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    throw new Error(`Failed to count pending transactions: ${error.message}`);
  }

  return count || 0;
}
