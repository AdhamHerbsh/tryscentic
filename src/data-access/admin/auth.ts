"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Verify that the current user has admin role
 * @throws Error if user is not authenticated or not an admin
 */
export async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return { user, supabase };
}

/**
 * Get current admin user ID
 */
export async function getAdminId(): Promise<string> {
  const { user } = await verifyAdmin();
  return user.id;
}

/**
 * Revalidate admin paths
 */
export async function revalidateAdminPaths() {
  revalidatePath("/(admin)", "layout");
}
