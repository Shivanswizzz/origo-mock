-- Migration: V1 Matching Engine Schema Changes
-- Purpose: Support Heuristic Logic & Candidate Generation

-- 1. Add missing columns to profiles (Required for V1 Logic)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS looking_for TEXT[] DEFAULT '{male, female}'::TEXT[],
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS popularity_score FLOAT DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS karma_score FLOAT DEFAULT 0.0;

-- 2. Candidate Generation Function (Heuristic Filter)
-- Call via RPC: supabase.rpc('get_candidates_v1', { match_mode: 'dating' })
CREATE OR REPLACE FUNCTION get_candidates_v1(
  query_user_id UUID DEFAULT auth.uid(), -- Default to caller
  match_mode TEXT DEFAULT 'dating',
  limit_count INTEGER DEFAULT 50
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  my_college_id UUID;
  my_gender TEXT;
  my_looking_for TEXT[];
  seen_ids UUID[];
BEGIN
  -- A. Get Context
  SELECT college_id, gender, looking_for 
  INTO my_college_id, my_gender, my_looking_for
  FROM public.profiles
  WHERE id = query_user_id;

  -- B. Get Blocked/Seen IDs (from Analytics & Connections)
  -- We exclude anyone you have already Liked, Passed, or Viewed extensively
  -- For V1, let's keep it simple: Exclude interaction history
  SELECT ARRAY(
    SELECT target_id FROM public.analytics_likes WHERE actor_id = query_user_id
    UNION
    SELECT reported_id FROM public.reports WHERE reporter_id = query_user_id
  ) INTO seen_ids;

  -- C. Return Candidates
  RETURN QUERY
  SELECT *
  FROM public.profiles p
  WHERE
    -- 1. Hard Filter: Same Campus
    p.college_id = my_college_id
    -- 2. Hard Filter: Not Self
    AND p.id != query_user_id
    -- 3. Hard Filter: Not Seen
    AND NOT (p.id = ANY(seen_ids))
    -- 4. Mode Specifics
    AND (
       -- Dating: Strict Gender Pref
       (match_mode = 'dating' AND p.gender = ANY(my_looking_for))
       OR
       -- Social: Low constraint for now
       (match_mode = 'social')
    )
    -- 5. Active Recently (last 30 days) - Optional for Demo
    -- AND p.last_active_at > NOW() - INTERVAL '30 days'
  ORDER BY 
    random() -- Shuffle for variety before scoring
  LIMIT limit_count;
END;
$$;
