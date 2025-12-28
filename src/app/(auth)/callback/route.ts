import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";

/**
 * Auth Callback Handler
 *
 * This route handles OAuth callbacks and email confirmation links from Supabase.
 * It exchanges the authorization code for a session and redirects the user.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      // Redirect to error page or login with error message
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_callback_error`
      );
    }
  }

  // Redirect to the next URL or home page
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
