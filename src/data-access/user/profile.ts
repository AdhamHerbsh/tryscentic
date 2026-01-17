import { createClient } from "@/lib/utils/supabase/client";
import { Profile } from "@/types/database";

/**
 * Update user profile details
 */
export async function updateProfile(userId: string, data: Partial<Profile>) {
  const supabase = createClient();

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return updatedProfile as Profile;
}

/**
 * Get user profile by ID - Client Side
 */
export async function getFullProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, role, wallet_balance, email, avatar_url, bio, is_banned, created_at"
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching full profile:", error);
    return null;
  }

  return data as Profile;
}

/**
 * Legacy getProfile - aliased to getFullProfile for compatibility
 */
export const getProfile = getFullProfile;
