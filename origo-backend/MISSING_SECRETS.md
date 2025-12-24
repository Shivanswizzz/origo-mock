# Missing Secrets & API Keys

The following keys and secrets are required for the Origo Backend to function fully. You must obtain these and configure them in your Supabase project dashboard or local environment.

## 1. Supabase Service Key (CRITICAL)
**Status:** REQUIRED for Edge Functions.
**Where to find:** Supabase Dashboard > Project Settings > API > `service_role` secret.
**Usage:** Used in Edge Functions to bypass RLS for admin tasks (like verifying emails).
**Env Var:** `SUPABASE_SERVICE_ROLE_KEY`

## 2. Razorpay Keys (Payments)
**Status:** Required for Premium, Ships, and Event Tickets.
**Where to find:** Razorpay Dashboard > Settings > API Keys.
**Env Vars:**
- `RAZORPAY_KEY_ID`: `rzp_live_...` or `rzp_test_...`
- `RAZORPAY_KEY_SECRET`: Secret key.
- `RAZORPAY_WEBHOOK_SECRET`: The secret you set when configuring the webhook URL (`.../functions/v1/payment-webhook`).

## 3. Cloudinary (Image Optimization)
**Status:** Recommended for Profile Photos and Verification ID uploads.
**Env Vars:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 4. ML Service (Future)
**Status:** Required for Phase 3/4.
**Env Var:**
- `ML_SERVICE_SECRET`: A shared secret string you generate to secure communications between your Python/ML service and Supabase.

## 5. College Domain List
**Status:** Required for `verify-college-email` function.
**Action:** You need to populate the `colleges` table in the database with legitimate domains (e.g., `iitd.ac.in`).
