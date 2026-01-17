import { createClient } from "@/lib/utils/supabase/server";

export interface Review {
  id: string;
  product_id?: string;
  user_id?: string;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
  title?: string; // If DB supports it, otherwise derived or omitted
}

export async function getLatestReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return [];

  // Fallback Mock Data if no reviews exist for demo purposes?
  // User requested "100% data-driven".
  return data || [];
}
