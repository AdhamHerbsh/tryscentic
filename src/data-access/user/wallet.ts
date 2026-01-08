import "server-only";
import { createClient } from "@/lib/utils/supabase/server";

export async function getUserTransactions() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) return [];

  const { data, error } = await (await supabase)
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}

export async function getUserBalance() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) return 0;

  const { data } = await (await supabase)
    .from("profiles")
    .select("wallet_balance")
    .eq("id", user.id)
    .single();

  return data?.wallet_balance || 0;
}

export async function getUserPaymentMethods() {
  // Currently we mocked this, but if we had a table we would fetch here.
  // For now return empty or mock if needed via server?
  // The user prompt said "Deactivate Visa and Apple Pay", so we only rely on Top Ups (manual).
  // Saved payment methods might not be relevant anymore or just empty.
  return [];
}
