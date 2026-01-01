-- Add missing onboarding_data column to profiles table
-- This fixes the error where saving profiling attributes fails
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Add index for potential querying inside JSONB
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles USING gin (onboarding_data);
