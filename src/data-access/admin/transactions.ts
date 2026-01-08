"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import type { Transaction } from "@/types/database";
import { revalidatePath } from "next/cache";

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
 * Process a top-up request (Approve/Reject)
 * Uses RPC for atomic update on approval
 */
export async function processTopUpRequest(input: {
  transaction_id: string;
  action: "approve" | "reject";
  admin_note?: string;
}) {
  const { supabase } = await verifyAdmin();

  // 1. Check current status first (Double-Spend Protection)
  const { data: tx, error: fetchError } = await supabase
    .from("transactions")
    .select("status, user_id, amount")
    .eq("id", input.transaction_id)
    .single();

  if (fetchError || !tx) {
    throw new Error("Transaction not found");
  }

  if (tx.status !== "pending") {
    throw new Error("Transaction is not pending");
  }

  // 2. Process
  if (input.action === "approve") {
    const { error } = await supabase.rpc("confirm_topup", {
      transaction_id: input.transaction_id,
      admin_note_input: input.admin_note,
    });

    if (error) throw new Error(error.message);

    // Send Success Email (Mock)
    console.log(
      `Sending Success Email to user ${tx.user_id} for amount ${tx.amount}`
    );
  } else {
    // Reject
    const { error } = await supabase
      .from("transactions")
      .update({
        status: "rejected",
        admin_note: input.admin_note,
      })
      .eq("id", input.transaction_id);

    if (error) throw new Error(error.message);

    // Send Rejection Email (Mock)
    console.log(
      `Sending Rejection Email to user ${tx.user_id}. Reason: ${input.admin_note}`
    );
  }

  revalidateAdminPaths();
  revalidatePath("/pages/account");
  return { success: true };
}

/**
 * Get pending transactions
 */
export async function getPendingTransactions() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      amount,
      type,
      status,
      description,
      proof_url,
      created_at,
      user:profiles(full_name, email)
    `
    )
    .eq("status", "pending")
    .eq("type", "deposit")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending transactions:", error);
    return [];
  }

  // Generate Signed URLs for proofs and fix user structure
  const transactionsWithSignedUrls = await Promise.all(
    data.map(async (tx) => {
      let proof_url = tx.proof_url;
      if (proof_url) {
        const { data: signed } = await supabase.storage
          .from("transaction_receipts")
          .createSignedUrl(proof_url, 3600); // 1 hour validity
        proof_url = signed?.signedUrl || null;
      }

      // Handle user array/object mismatch
      // @ts-ignore
      const user = Array.isArray(tx.user) ? tx.user[0] : tx.user;

      return {
        ...tx,
        proof_url,
        user,
      };
    })
  );

  return transactionsWithSignedUrls;
}
