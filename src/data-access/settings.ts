import { createClient } from "@/lib/utils/supabase/server";

export async function getSiteSettings(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) return null;
  return data.value;
}

export async function getAllSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) return {};

  // Transform to object for easier consumption
  const settings: Record<string, any> = {};
  data?.forEach((item) => {
    settings[item.key] = item.value;
  });

  return settings;
}
