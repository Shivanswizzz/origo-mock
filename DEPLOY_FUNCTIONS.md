# Deploying Backend Functions (Logic Layer)

The "Backend Error" happens because your app is trying to call logic (like "Check Rizz Limit") that hasn't been put on the server yet.

Since you are likely not using the command line tool (`supabase CLI`), the easiest way is to copy-paste the code into the Dashboard.

## 1. rizz-message-limit (Required)
1.  Go to **Supabase Dashboard** -> **Edge Functions** (Icon looks like `(fx)`).
2.  Click **Create a new function**.
3.  Name it: `rizz-message-limit`.
4.  Copy the code from: `origo-backend/supabase/functions/rizz-message-limit/index.ts`.
5.  Paste it into the editor.
6.  Click **Deploy**.

## 2. verify-college-email (Optional but Recommended)
1.  Go to **Supabase Dashboard** -> **Edge Functions**.
2.  Click **Create a new function**.
3.  Name it: `verify-college-email`.
4.  Copy the code from: `origo-backend/supabase/functions/verify-college-email/index.ts`.
5.  Paste it into the editor.
6.  Click **Deploy**.

**Once deployed, the app will be able to call them successfully.**
