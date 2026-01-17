import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/utils/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "user" | "admin";
  wallet_balance: number;
  created_at: string;
}

// Query Keys
export const userKeys = {
  all: ["admin-users"] as const,
  list: () => [...userKeys.all, "list"] as const,
};

// Fetch function
async function fetchUsers(): Promise<UserProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as UserProfile[];
}

// Hook
export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
  });
}
