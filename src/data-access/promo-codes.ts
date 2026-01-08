"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function getActivePromoCodes() {
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promo codes:", error);
    return [];
  }

  // Filter out usage limited ones that are used up
  return (data || []).filter((promo) => {
    if (promo.usage_limit && promo.times_used >= promo.usage_limit)
      return false;
    return true;
  });
}
