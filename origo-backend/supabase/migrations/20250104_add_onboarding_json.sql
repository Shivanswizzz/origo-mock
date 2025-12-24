-- Add onboarding_data JSONB column to profiles table
-- This stores the Hinge-style question answers for the ML Engine
-- Format example: {"social_level": "Homebody", "weekend_vibe": "Gaming", ...}

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Also add a column for Last ML Update to track when we need to re-generate vectors
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_ml_update TIMESTAMPTZ;

-- Index for querying specific keys if needed later
CREATE INDEX IF NOT EXISTS idx_mid_onboarding_data ON profiles USING gin (onboarding_data);
