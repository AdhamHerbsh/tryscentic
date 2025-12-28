"use server";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFavoriteProductIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data.map((item) => item.product_id);
}

export async function isProductFavorite(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Error checking favorite:", error);
  }

  return !!data;
}

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to manage favorites");
  }

  try {
    // Check if already favorite
    const { data: existing, error: fetchError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      // Remove
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
    } else {
      // Add
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) throw error;
    }

    revalidatePath("/pages/shop");
    revalidatePath(`/pages/shop/${productId}`);
    revalidatePath("/pages/user-dashboard");

    return !existing;
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    throw error;
  }
}
