-- Migration: V1 Scoring Logic (Updated)
-- Purpose: Implement matching score AND return joined data (College Name)

-- Helper: Jaccard Similarity for Arrays
CREATE OR REPLACE FUNCTION jaccard_similarity(arr1 TEXT[], arr2 TEXT[])
RETURNS FLOAT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    intersection_count INT;
    union_count INT;
BEGIN
    IF arr1 IS NULL OR arr2 IS NULL OR array_length(arr1, 1) IS NULL OR array_length(arr2, 1) IS NULL THEN
        RETURN 0.0;
    END IF;

    SELECT COUNT(*) INTO intersection_count
    FROM (SELECT UNNEST(arr1) INTERSECT SELECT UNNEST(arr2)) t;

    SELECT COUNT(*) INTO union_count
    FROM (SELECT UNNEST(arr1) UNION SELECT UNNEST(arr2)) t;

    IF union_count = 0 THEN RETURN 0.0; END IF;
    
    RETURN intersection_count::FLOAT / union_count::FLOAT;
END;
$$;

-- Core Scoring Function
CREATE OR REPLACE FUNCTION calculate_match_score(
  user_a_id UUID,
  user_b_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  score FLOAT := 0;
  
  -- User A
  ua_interests TEXT[];
  ua_data JSONB;
  
  -- User B
  ub_interests TEXT[];
  ub_data JSONB;
  
  -- Component Scores
  score_interests FLOAT := 0;
  score_personality FLOAT := 0;
  score_community FLOAT := 0;
  
  -- Weights (V1 Spec)
  w_interests FLOAT := 0.40;
  w_personality FLOAT := 0.30;
  w_community FLOAT := 0.30;
  
BEGIN
  -- Fetch Data
  SELECT interests, onboarding_data 
  INTO ua_interests, ua_data 
  FROM public.profiles WHERE id = user_a_id;
  
  SELECT interests, onboarding_data 
  INTO ub_interests, ub_data 
  FROM public.profiles WHERE id = user_b_id;

  -- 1. Interest Similarity (Jaccard)
  score_interests := jaccard_similarity(ua_interests, ub_interests);
  
  -- 2. Personality Alignment (Simple Key Matching)
  -- Attributes: social_level, weekend_vibe, dating_intent
  IF (ua_data->>'dating_intent' = ub_data->>'dating_intent') THEN score_personality := score_personality + 0.4; END IF;
  IF (ua_data->>'social_level' = ub_data->>'social_level') THEN score_personality := score_personality + 0.3; END IF;
  IF (ua_data->>'weekend_vibe' = ub_data->>'weekend_vibe') THEN score_personality := score_personality + 0.3; END IF;
  
  -- 3. Community (Placeholder)
  score_community := 0.5;

  -- Weighted Sum
  score := (score_interests * w_interests) + (score_personality * w_personality) + (score_community * w_community);
  
  -- Return Details
  RETURN jsonb_build_object(
    'total_score', (score * 100)::INT,
    'details', jsonb_build_object(
      'interest_match', (score_interests * 100)::INT,
      'personality_match', (score_personality * 100)::INT,
      'dating_intent_match', (ua_data->>'dating_intent' = ub_data->>'dating_intent')
    )
  );
END;
$$;

-- API Function: Get Scored Matches
-- RETURNS profiles + college name + score
CREATE OR REPLACE FUNCTION get_scored_matches_v1(
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_data JSONB,
  score_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  uid UUID := auth.uid();
  candidate RECORD;
  s JSONB;
  c_name TEXT;
  full_data JSONB;
BEGIN
  -- Loop through candidates
  FOR candidate IN SELECT * FROM get_candidates_v1(uid, 'dating', 50) 
  LOOP
    -- Calculate Score
    s := calculate_match_score(uid, candidate.id);
    
    -- Fetch College Name
    SELECT name INTO c_name FROM public.colleges WHERE id = candidate.college_id;
    
    -- Enhance user_data with college object to match frontend expectation
    full_data := to_jsonb(candidate) || jsonb_build_object('college', jsonb_build_object('name', c_name));
    
    -- Output format
    user_data := full_data;
    score_data := s;
    RETURN NEXT;
  END LOOP;
END;
$$;
