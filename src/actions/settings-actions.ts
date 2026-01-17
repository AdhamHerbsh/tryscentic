"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAllSettingsAction() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*");

  const settings: Record<string, any> = {};
  data?.forEach((item) => {
    settings[item.key] = item.value;
  });
  return settings;
}

export async function updateSiteSettings(key: string, value: any) {
  const supabase = await createClient();

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check role from profiles using direct query if needed, or rely on RLS.
  // Since we have RLS "Admin all site settings" using exists(profile where id=auth.uid() and role='admin'),
  // we can just try to upsert.

  // However, it's safer to not catch the error if it's RLS related so the UI knows.

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Error updating site settings:", error);
    throw new Error("Failed to update settings");
  }

  revalidatePath("/", "layout"); // Revalidate everything as settings usually affect global layout
  return { success: true };
}

export async function uploadAssetAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const category = (formData.get("category") as string) || "general";

  if (!file) return { success: false, error: "No file provided" };

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Check if site_assets bucket exists, if not, maybe fail or try product_images?
  // We created it in SQL, so it should exist.

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `assets/images/${category}/${Date.now()}_${cleanName}`;

  const { error } = await supabase.storage
    .from("site_assets")
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Upload error details:", error);
    return { success: false, error: "Upload failed: " + error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("site_assets").getPublicUrl(path);

  return { success: true, url: publicUrl };
}
