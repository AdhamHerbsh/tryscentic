"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function submitTopUpRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const file = formData.get("proof") as File;

  if (!amount || amount < 50) {
    return { success: false, message: "Minimum amount is 50 LE" };
  }

  if (!file || file.size === 0) {
    return { success: false, message: "Please upload a payment proof" };
  }

  // Upload file
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

  // Upload to transaction_receipts bucket
  const { error: uploadError } = await supabase.storage
    .from("transaction_receipts")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { success: false, message: "Failed to upload proof" };
  }

  // Insert Transaction
  // using 'deposit' as type since it fits the 'top_up' concept and exists in enum
  const { error: dbError } = await supabase.from("transactions").insert({
    user_id: user.id,
    type: "deposit",
    amount: amount,
    description: `Top-up via ${method}`,
    status: "pending",
    proof_url: fileName,
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { success: false, message: "Failed to create transaction record" };
  }

  revalidatePath("/pages/account/wallet");
  return { success: true, message: "Top-up request submitted successfully" };
}

export async function processTransaction(
  transactionId: string,
  action: "confirmed" | "rejected",
  adminNote?: string
) {
  const supabase = await createClient();

  // Validate Admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin only" };
  }

  try {
    if (action === "confirmed") {
      const { error } = await supabase.rpc("confirm_topup", {
        transaction_id: transactionId,
        admin_note_input: adminNote,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("transactions")
        .update({ status: "rejected", admin_note: adminNote })
        .eq("id", transactionId);
      if (error) throw error;
    }

    revalidatePath("/dashboard");
    return { success: true, message: `Transaction ${action}` };
  } catch (error: any) {
    console.error("Process Transaction Error:", error);
    return { success: false, message: error.message || "Operation failed" };
  }
}
