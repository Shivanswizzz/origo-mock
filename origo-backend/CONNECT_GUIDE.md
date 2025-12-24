# How to Connect Origo Backend

This guide explains how to apply the database schema and deploy the backend functions.

## Prerequisites
1.  **Supabase CLI** installed on your machine (`npm install -g supabase`).
2.  **Docker** running (required for local development/testing of functions).
3.  **Login**: Run `supabase login` in your terminal.

## Step 1: Link Project
Run this command in the `origo-backend` directory:
```bash
supabase link --project-ref srkqvxpeoipsnicmeunp
```
*Enter your database password when prompted.*

## Step 2: Push Database Schema
Apply the tables, policies, and triggers to your live Supabase project:
```bash
supabase db push
```
*This will execute the SQL migration file in `supabase/migrations/`.*

## Step 3: Deploy Edge Functions
Deploy the serverless functions to the cloud:
```bash
supabase functions deploy rizz-message-limit
supabase functions deploy verify-college-email
supabase functions deploy payment-webhook
supabase functions deploy generate-compatibility-score
```

## Step 4: Set Secrets
Set the production secrets for your functions (replace values with your actual keys):
```bash
supabase secrets set RAZORPAY_WEBHOOK_SECRET="your_secret_here"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_key_here"
```

## Step 5: Frontend Connection
The frontend is already configured to look for:
- **URL**: `https://srkqvxpeoipsnicmeunp.supabase.co`
- **Key**: `sb_publishable_hG3GcXSBpIMVO0Mm2CF1jw_nSSFG7Wq`

You can find the client initialization in `origo-frontend/src/lib/supabase.js`.
