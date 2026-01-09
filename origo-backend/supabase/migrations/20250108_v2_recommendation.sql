-- Migration: V2 Recommendation Engine
-- Purpose: Implement PRD requirements for matching, personalization, and engagement.
-- Author: Antigravity (v2)

-- 1. Helper: Availability Overlap (Simulation for V1)
-- In a real app, this would check a 'schedules' table. 
-- For now, we use a simple heuristic based on 'social_level'.
CREATE OR REPLACE FUNCTION availability_overlap(user_a_id UUID, user_b_id UUID)
RETURNS FLOAT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    ua_social TEXT;
    ub_social TEXT;
BEGIN
    SELECT onboarding_data->>'social_level' INTO ua_social FROM profiles WHERE id = user_a_id;
    SELECT onboarding_data->>'social_level' INTO ub_social FROM profiles WHERE id = user_b_id;
    
    IF ua_social = ub_social THEN RETURN 1.0; END IF;
    RETURN 0.5;
END;
$$;

-- 2. Helper: Activity Score
-- Measures how active a user has been recently based on interaction logs.
CREATE OR REPLACE FUNCTION calculate_activity_score(target_user_id UUID)
RETURNS FLOAT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    recent_interactions INT;
BEGIN
    SELECT COUNT(*) INTO recent_interactions 
    FROM analytics_likes 
    WHERE actor_id = target_user_id AND created_at > NOW() - INTERVAL '7 days';
    
    -- Normalize: 10+ interactions = 1.0 score
    RETURN LEAST(recent_interactions::FLOAT / 10.0, 1.0);
END;
$$;

-- 3. Helper: Freshness Score
-- Measures how recently the profile was updated or created.
CREATE OR REPLACE FUNCTION calculate_freshness_score(target_user_id UUID)
RETURNS FLOAT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    updated_at TIMESTAMP WITH TIME ZONE;
    days_since_update FLOAT;
BEGIN
    SELECT COALESCE(last_active_at, created_at) INTO updated_at FROM profiles WHERE id = target_user_id;
    days_since_update := EXTRACT(EPOCH FROM (NOW() - updated_at)) / 86400.0;
    
    -- Decay: 1.0 for today, 0.0 for 30+ days
    RETURN GREATEST(1.0 - (days_since_update / 30.0), 0.0);
END;
$$;

-- 4. Enhanced Scoring Function V2
CREATE OR REPLACE FUNCTION calculate_match_score_v2(
  user_a_id UUID,
  user_b_id UUID,
  w1 FLOAT DEFAULT 0.30, -- Interest Similarity
  w2 FLOAT DEFAULT 0.20, -- Community Overlap
  w3 FLOAT DEFAULT 0.20, -- Personality Alignment
  w4 FLOAT DEFAULT 0.15, -- Activity Score
  w5 FLOAT DEFAULT 0.15  -- Freshness
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  -- User Data
  ua_interests TEXT[];
  ua_data JSONB;
  ub_interests TEXT[];
  ub_data JSONB;
  
  -- Component Scores
  s_interests FLOAT := 0;
  s_community FLOAT := 0;
  s_personality FLOAT := 0;
  s_activity FLOAT := 0;
  s_freshness FLOAT := 0;
  
  total_score FLOAT := 0;
  explain_string TEXT;
BEGIN
  -- Fetch Data
  SELECT interests, onboarding_data INTO ua_interests, ua_data FROM profiles WHERE id = user_a_id;
  SELECT interests, onboarding_data INTO ub_interests, ub_data FROM profiles WHERE id = user_b_id;

  -- 1. Interest Similarity
  s_interests := jaccard_similarity(ua_interests, ub_interests);
  
  -- 2. Community Overlap (Simplified for V1: Same major or shared interests)
  IF (ua_data->>'major' = ub_data->>'major') THEN s_community := s_community + 0.5; END IF;
  s_community := s_community + (s_interests * 0.5); -- Interest similarity feeds into community
  s_community := LEAST(s_community, 1.0);

  -- 3. Personality Alignment
  IF (ua_data->>'dating_intent' = ub_data->>'dating_intent') THEN s_personality := s_personality + 0.4; END IF;
  IF (ua_data->>'social_level' = ub_data->>'social_level') THEN s_personality := s_personality + 0.3; END IF;
  IF (ua_data->>'weekend_vibe' = ub_data->>'weekend_vibe') THEN s_personality := s_personality + 0.3; END IF;

  -- 4. Activity Score
  s_activity := calculate_activity_score(user_b_id);

  -- 5. Freshness
  s_freshness := calculate_freshness_score(user_b_id);

  -- Weighted Sum
  total_score := (s_interests * w1) + (s_community * w2) + (s_personality * w3) + (s_activity * w4) + (s_freshness * w5);

  -- Explainability Hook
  IF s_interests > 0.7 THEN explain_string := 'You both love similar things!';
  ELSIF s_personality > 0.8 THEN explain_string := 'Your vibes are perfectly aligned.';
  ELSIF s_community > 0.6 THEN explain_string := 'You share a lot of common ground.';
  ELSE explain_string := 'A fresh face with great potential!';
  END IF;

  RETURN jsonb_build_object(
    'total_score', (total_score * 100)::INT,
    'explanation', explain_string,
    'details', jsonb_build_object(
      'interests', (s_interests * 100)::INT,
      'community', (s_community * 100)::INT,
      'personality', (s_personality * 100)::INT,
      'activity', (s_activity * 100)::INT,
      'freshness', (s_freshness * 100)::INT
    )
  );
END;
$$;

-- v2 Antigravity (Recommendation Engine)
