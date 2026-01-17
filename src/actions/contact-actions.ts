"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    name: formData.name,
    email: formData.email,
    message: formData.message,
  });

  if (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Failed to submit, please try again.");
  }

  return { success: true };
}

export async function subscribeNewsletter(email: string) {
  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return { success: true, message: "Already subscribed!" };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
  });

  if (error) {
    // Handle unique violation if race condition occurs
    if (error.code === "23505") {
      // unique_violation
      return { success: true, message: "Already subscribed!" };
    }
    console.error("Error subscribing to newsletter:", error);
    throw new Error("Failed to subscribe.");
  }

  return { success: true, message: "Successfully subscribed!" };
}
