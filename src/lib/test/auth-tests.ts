/**
 * Authentication Test Suite
 *
 * Run this in your browser console to test auth flows
 * Open DevTools (F12) → Console → Paste and run these functions
 */

// Initialize Supabase client (assuming you're on the site)
// This uses the global window object, so run it in browser console

async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase connection...");

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Connection failed:", error);
      return false;
    }

    console.log("✅ Supabase connected!");
    console.log("Session:", data.session ? "Active" : "None");
    if (data.session) {
      console.log("User:", data.session.user.email);
    }
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function testSignUp(email: string, password: string, name: string) {
  console.log(`🔐 Testing signup for: ${email}`);

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("❌ Signup failed:", error.message);
      return false;
    }

    console.log("✅ Signup successful!");
    console.log("User ID:", data.user?.id);
    console.log("⚠️ Check your email for confirmation link");
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function testLogin(email: string, password: string) {
  console.log(`🔐 Testing login for: ${email}`);

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login failed:", error.message);
      return false;
    }

    console.log("✅ Login successful!");
    console.log("User:", data.user.email);
    console.log(
      "Session expires:",
      new Date(data.session.expires_at || 0).toLocaleString()
    );
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function testPasswordReset(email: string) {
  console.log(`📧 Sending password reset to: ${email}`);

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("❌ Password reset failed:", error.message);
      return false;
    }

    console.log("✅ Password reset email sent!");
    console.log("⚠️ Check your email inbox");
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function testLogout() {
  console.log("🚪 Testing logout...");

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Logout failed:", error.message);
      return false;
    }

    console.log("✅ Logout successful!");
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function testGetProfile() {
  console.log("👤 Fetching user profile...");

  try {
    const { createClient } = await import("@/lib/utils/supabase/client");
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("⚠️ No user logged in");
      return false;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Failed to fetch profile:", error.message);
      return false;
    }

    console.log("✅ Profile fetched!");
    console.log(profile);
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
}

async function runFullAuthTest() {
  console.log("🚀 Running full authentication test suite...\n");

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";
  const testName = "Test User";

  console.log("Test credentials:");
  console.log(`Email: ${testEmail}`);
  console.log(`Password: ${testPassword}\n`);

  // Test 1: Connection
  await testSupabaseConnection();
  await new Promise((r) => setTimeout(r, 1000));

  // Test 2: Signup
  await testSignUp(testEmail, testPassword, testName);
  await new Promise((r) => setTimeout(r, 2000));

  // Test 3: Profile
  await testGetProfile();
  await new Promise((r) => setTimeout(r, 1000));

  // Test 4: Logout
  await testLogout();
  await new Promise((r) => setTimeout(r, 1000));

  // Test 5: Login
  await testLogin(testEmail, testPassword);
  await new Promise((r) => setTimeout(r, 1000));

  // Test 6: Password Reset
  await testPasswordReset(testEmail);
  await new Promise((r) => setTimeout(r, 1000));

  console.log("\n✨ Test suite completed!");
  console.log(
    "⚠️ Note: You may need to confirm your email before some features work"
  );
}

// Export all test functions
export {
  testSupabaseConnection,
  testSignUp,
  testLogin,
  testPasswordReset,
  testLogout,
  testGetProfile,
  runFullAuthTest,
};

/**
 * USAGE EXAMPLES:
 *
 * // Test connection
 * testSupabaseConnection()
 *
 * // Test signup
 * testSignUp('user@example.com', 'password123', 'John Doe')
 *
 * // Test login
 * testLogin('user@example.com', 'password123')
 *
 * // Test password reset
 * testPasswordReset('user@example.com')
 *
 * // Test logout
 * testLogout()
 *
 * // Get current user profile
 * testGetProfile()
 *
 * // Run all tests
 * runFullAuthTest()
 */
