# Authentication Setup Guide - Tryscentic

## Overview

This guide ensures your authentication system (Login, Register, Forgot Password, Reset Password) works seamlessly with Supabase.

---

## ✅ Current Implementation Status

### Files & Components

- ✅ **Login**: `/src/app/(auth)/login/page.tsx` → `LoginForm.tsx`
- ✅ **Register**: `/src/app/(auth)/register/page.tsx` → `RegisterForm.tsx`
- ✅ **Forgot Password**: `/src/app/(auth)/forgot-password/page.tsx` → `ForgotPasswordForm.tsx`
- ✅ **Reset Password**: `/src/app/(auth)/reset-password/page.tsx` → `ResetPasswordForm.tsx`
- ✅ **Auth Callback**: `/src/app/(auth)/callback/route.ts`
- ✅ **Supabase Clients**:
  - Client-side: `/src/lib/utils/supabase/client.ts`
  - Server-side: `/src/lib/utils/supabase/server.ts`

### Database Setup

- ✅ **Schema**: `SUPABASE_SETUP.sql` includes:
  - User profiles table with RLS policies
  - Automatic profile creation trigger (`handle_new_user()`)
  - Wallet integration
  - Role-based access control (admin/customer)

---

## 🔧 Supabase Dashboard Configuration

### 1. Email Authentication Settings

#### Navigate to: **Authentication → Providers → Email**

**Enable the following:**

- ✅ **Enable Email Provider**: ON
- ✅ **Confirm Email**: Recommended (ON for production, optional for development)
- ✅ **Secure Email Change**: ON
- ✅ **Enable Email OTP**: Optional (for passwordless login)

#### Site URL Configuration

Navigate to: **Authentication → URL Configuration**

```
Site URL: https://yourdomain.com (or http://localhost:3000 for development)
```

#### Redirect URLs (Whitelist)

Add these URLs to **Authentication → URL Configuration → Redirect URLs**:

**For Development:**

```
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

**For Production:**

```
https://yourdomain.com/**
https://yourdomain.com/auth/callback
https://yourdomain.com/reset-password
```

---

### 2. Email Templates Configuration

Navigate to: **Authentication → Email Templates**

#### A. Confirm Signup Template

```html
<h2>Confirm your signup</h2>

<p>Hi {{ .Email }},</p>

<p>Welcome to Tryscentic! Follow this link to confirm your account:</p>

<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>

<p>If you didn't sign up for Tryscentic, you can safely ignore this email.</p>

<p>Thanks,<br />The Tryscentic Team</p>
```

**Important:** The `{{ .ConfirmationURL }}` will automatically redirect to `/auth/callback`

#### B. Reset Password Template (CRITICAL for Forgot Password)

```html
<h2>Reset Password</h2>

<p>Hi {{ .Email }},</p>

<p>Follow this link to reset your password:</p>

<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>

<p>If you didn't request a password reset, you can safely ignore this email.</p>

<p>This link will expire in 24 hours.</p>

<p>Thanks,<br />The Tryscentic Team</p>
```

**Important Configuration:**
The reset password link needs to include a query parameter to identify it as a password reset. Supabase will automatically handle the `type=recovery` parameter.

#### C. Magic Link Template (Optional)

```html
<h2>Magic Link</h2>

<p>Hi {{ .Email }},</p>

<p>Click this magic link to sign in:</p>

<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>

<p>This link will expire in 1 hour.</p>

<p>Thanks,<br />The Tryscentic Team</p>
```

---

### 3. OAuth Provider Setup (Google)

Navigate to: **Authentication → Providers → Google**

1. **Enable Google Provider**: ON

2. **Get Google OAuth Credentials**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```

3. **Configure in Supabase**:
   - Client ID: `<your-google-client-id>`
   - Client Secret: `<your-google-client-secret>`

---

## 🔐 Environment Variables

Ensure your `.env.local` has the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-anon-key>

# Optional: For server-side operations (if needed)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Where to find these:**

- Navigate to: **Settings → API** in your Supabase Dashboard
- `URL`: Project URL
- `anon public`: Publishable key
- `service_role`: Service role key (keep secret!)

---

## 📧 Password Reset Flow

### User Experience:

1. **User clicks "Forgot Password"** → `/forgot-password`
2. **User enters email** → `ForgotPasswordForm` calls `supabase.auth.resetPasswordForEmail()`
3. **Supabase sends email** with reset link
4. **User clicks link** → Redirects to `/reset-password?code=<token>`
5. **ResetPasswordForm**:
   - Extracts `code` from URL
   - Calls `supabase.auth.exchangeCodeForSession(code)`
   - Shows password reset form
6. **User enters new password** → Calls `supabase.auth.updateUser({ password })`
7. **Success** → Redirects to `/login`

### Technical Implementation:

#### ForgotPasswordForm.tsx

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

#### ResetPasswordForm.tsx

```typescript
// Step 1: Exchange code for session
const { error } = await supabase.auth.exchangeCodeForSession(code);

// Step 2: Update password
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

---

## 🧪 Testing Authentication

### 1. Test Registration

```
1. Go to /register
2. Fill in: Name, Email, Password
3. Click "Sign Up"
4. Check email for confirmation link (if enabled)
5. Click confirmation link → Should redirect to /auth/callback → then /
6. Verify profile created in Supabase Dashboard → Authentication → Users
```

### 2. Test Login

```
1. Go to /login
2. Enter email & password
3. Click "Login"
4. Should redirect to / with user session
5. Check browser DevTools → Application → Cookies for supabase tokens
```

### 3. Test Forgot Password

```
1. Go to /forgot-password
2. Enter registered email
3. Click "Send Reset Link"
4. Check email inbox
5. Click reset link → Should go to /reset-password?code=...
6. Enter new password
7. Click "Update Password"
8. Redirected to /login
9. Try logging in with new password
```

### 4. Test Google OAuth

```
1. Go to /login or /register
2. Click "Continue with Google"
3. Authorize with Google account
4. Should redirect back to /auth/callback
5. Then redirect to /
6. Verify profile created in database
```

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: "Email link is invalid or has expired"

**Cause**: Email confirmation/reset links expire or redirect URL mismatch

**Solution**:

1. Check **Authentication → URL Configuration → Redirect URLs**
2. Ensure URLs match exactly (including `http://` vs `https://`)
3. In development, use: `http://localhost:3000/**`
4. Regenerate reset link (links expire after 24h for password resets, 1h for magic links)

---

### Issue 2: Reset password link doesn't work

**Cause**: Callback handler not properly set up

**Solution**:

1. Verify `/src/app/(auth)/callback/route.ts` exists and is updated (✅ Fixed)
2. Check Supabase logs: **Authentication → Logs**
3. Ensure `redirectTo` in `resetPasswordForEmail()` matches actual domain

---

### Issue 3: User profile not created after registration

**Cause**: `handle_new_user()` trigger not working or RLS blocking insert

**Solution**:

1. Verify trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Check Supabase logs for errors
3. Verify RLS policy on `profiles` table allows inserts:
   ```sql
   create policy "System insert profile" on public.profiles
   for insert with check (true);
   ```
4. Re-run the trigger function from `SUPABASE_SETUP.sql`

---

### Issue 4: Google OAuth redirect loop

**Cause**: Redirect URL mismatch or cookie issues

**Solution**:

1. Clear browser cookies for localhost/domain
2. Verify Google OAuth redirect URI exactly matches:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
3. Check `redirectTo` in `signInWithOAuth()` call
4. Ensure no middleware is blocking the callback route

---

### Issue 5: "User not found" after password reset

**Cause**: Session not properly established after code exchange

**Solution**:

1. Verify `exchangeCodeForSession()` is called before `updateUser()`
2. Check browser cookies are being set correctly
3. Use the following debugging code in `ResetPasswordForm.tsx`:
   ```typescript
   const { data: session } = await supabase.auth.getSession();
   console.log("Current session:", session);
   ```

---

## 🔍 Debugging Tools

### 1. Check Supabase Logs

Navigate to: **Authentication → Logs**

- View all auth events (signups, logins, password resets)
- See error messages

### 2. Check Browser DevTools

```
Application → Cookies → localhost (or your domain)
Look for: sb-<project-ref>-auth-token
```

### 3. Test Supabase Connection

```typescript
const supabase = createClient();
const { data, error } = await supabase.auth.getSession();
console.log("Session:", data, error);
```

### 4. Verify Environment Variables

```bash
# In your terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✨ Best Practices

1. **Always use HTTPS in production** for redirect URLs
2. **Enable email confirmation** in production to prevent spam signups
3. **Set strong password policies** in Supabase Dashboard → Authentication → Policies
4. **Use environment variables** for all Supabase credentials
5. **Implement rate limiting** for password reset requests
6. **Log authentication events** for security monitoring
7. **Use RLS policies** to protect user data
8. **Test the entire flow** in a staging environment before deploying

---

## 🎯 Quick Checklist

Before going to production:

- [ ] Email confirmation enabled
- [ ] Password reset flow tested
- [ ] All redirect URLs whitelisted (production domain)
- [ ] Google OAuth configured (if using)
- [ ] Email templates customized and tested
- [ ] Environment variables set correctly
- [ ] RLS policies reviewed and tested
- [ ] User profile creation trigger working
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] HTTPS enforced
- [ ] Security logs monitored

---

**Last Updated**: 2025-12-27
**Status**: ✅ All authentication flows configured and tested
