"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { Profile } from "@/types/database";

/**
 * Fetch full profile on the server side
 * Prevents layout shift for critical pages like Checkout/Admin
 */
export async function getServerFullProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  // Get current user first
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, role, wallet_balance, email, avatar_url, bio, is_banned, created_at"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Server fetch profile error:", error);
    return null;
  }

  return data as Profile;
}
