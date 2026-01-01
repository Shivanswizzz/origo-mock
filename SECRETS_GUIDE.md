# FINAL FIX: Add Secrets

The code is deployed, but it's failing because the server doesn't have the "Keys" to talk to your database. When running on your laptop, it uses `.env`. On the server, you must add these manually.

### 1. Get your keys
Open your `.env` file on your Desktop and copy:
1.  `SUPABASE_URL` (starts with `https://...`)
2.  `SUPABASE_ANON_KEY` (starts with `ey...`)

### 2. Add them to Dashboard
1.  Go to **Supabase Dashboard** -> **Edge Functions**.
2.  Click **"Manage Secrets"** (usually top right or in settings).
3.  Add a new secret:
    *   Name: `SUPABASE_URL`
    *   Value: *(Paste your URL)*
4.  Add another secret:
    *   Name: `SUPABASE_ANON_KEY`
    *   Value: *(Paste your Anon Key)*

### 3. Verify
Once added, the functions will automatically restart. Try signing up again—it should work perfectly!
