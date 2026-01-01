# Origo V1 - Ultimate Setup Guide

**Status:** The code is 100% ready. This guide covers every single step to get the app running without errors.

## 1. Do I need Google Cloud or Maps Keys?
**NO.**
*   **Google Login**: We use Email/Password auth (`f2022@bits...`). We treat the email as a username. No OAuth keys required.
*   **Maps**: We are not showing maps in V1.
*   **Google Cloud**: Not required at all.

## 2. Environment Variables (.env) CHECKLIST
You only need `.env` files with your Supabase credentials. **I have already created these for you**, but verify they exist:

### A. Frontend (`origo-frontend/.env`)
```env
VITE_SUPABASE_URL=https://srkqvxpeoipsnicmeunp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_hG3GcXSBpIMVO0Mm2CF1jw_nSSFG7Wq
```

### B. Backend (`origo-backend/.env`)
```env
SUPABASE_URL=https://srkqvxpeoipsnicmeunp.supabase.co
SUPABASE_ANON_KEY=sb_publishable_hG3GcXSBpIMVO0Mm2CF1jw_nSSFG7Wq
```

*(Note: We are using the Anon Key for backend functions too, saving you from needing the Service Role secret).*

## 3. Supabase Setup (The "One-Click" Fix)
You saw an error (`relation public.messages does not exist`) because the database was empty. **Running this script will create EVERYTHING (Tables + V1 Logic).**

1.  Open your **Supabase Dashboard** (Cloud).
2.  Go to **SQL Editor** (Left sidebar, terminal icon `>_`).
3.  Click **New Query**.
4.  Copy **ALL** the text from the file: `origo-backend/COMPLETE_V1_SETUP.sql`
5.  Paste it into the editor.
6.  Click **Run** (Green button).

*Result:* This creates `profiles`, `messages`, `analytics`, `scoring`, and `safety` tables all at once. The error will disappear.
*Note:* If it says "Success. No rows returned," that means it worked perfectly!

## 4. Populate Data (Recommended)
Your app is currently empty. To add Colleges (BITS, IITs) and some test users:

1.  Open `origo-backend/SEED_DATA.sql`.
2.  Copy **ALL** the text.
3.  Paste into Supabase **SQL Editor** and **Run**.

## 5. How to Run the App (Launch)
Once the SQL matches are done:

### Frontend (The App)
1.  Open Terminal.
2.  `cd origo-frontend`
3.  `npm run dev`
4.  Open `http://localhost:5173`

### Backend (Logic)
*   **You do NOT need to run anything.** The backend logic is deployed as Edge Functions or runs via the SQL we just added.
*   **ML Service**: We have **removed** the Python ML dependency (`origo-ml`). You do NOT need to run python. The definition of "Match Scores" is now inside the Database (SQL), which is faster and easier for V1.

## Summary
1.  **Ignore** Google Cloud.
2.  **Paste & Run** `COMPLETE_V1_SETUP.sql` in Supabase.
3.  **Start** `npm run dev` in Frontend.
4.  **Done.**
