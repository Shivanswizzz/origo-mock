-- ORIGO RECOMMENDATION ENGINE V2
-- This script implements the weighted scoring model and refined candidate generation.

BEGIN;

--------------------------------------------------------------------------------
-- 1. SCORING HELPERS (Refined)
--------------------------------------------------------------------------------

-- Community Overlap Helper
CREATE OR REPLACE FUNCTION get_community_overlap(user_a_id UUID, user_b_id UUID)
RETURNS FLOAT LANGUAGE plpgsql STABLE AS $$
DECLARE
    common_count INT;
    total_a INT;
BEGIN
    SELECT COUNT(*) INTO common_count 
    FROM public.community_members am
    JOIN public.community_members bm ON am.community_id = bm.community_id
    WHERE am.user_id = user_a_id AND bm.user_id = user_b_id;

    SELECT COUNT(*) INTO total_a FROM public.community_members WHERE user_id = user_a_id;
    
    IF total_a = 0 THEN RETURN 0.0; END IF;
    RETURN common_count::FLOAT / total_a::FLOAT;
END;
$$;

-- Activity Score Helper (Normalized 0-1 based on last 7 days)
CREATE OR REPLACE FUNCTION get_activity_score(last_active_at TIMESTAMPTZ)
RETURNS FLOAT LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    days_since FLOAT;
BEGIN
    IF last_active_at IS NULL THEN RETURN 0.0; END IF;
    days_since := EXTRACT(EPOCH FROM (NOW() - last_active_at)) / 86400;
    IF days_since > 7 THEN RETURN 0.0; END IF;
    RETURN 1.0 - (days_since / 7.0);
END;
$$;

-- Freshness Score Helper (Normalized 0-1 based on last 30 days)
CREATE OR REPLACE FUNCTION get_freshness_score(created_at TIMESTAMPTZ)
RETURNS FLOAT LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    days_since FLOAT;
BEGIN
    IF created_at IS NULL THEN RETURN 0.0; END IF;
    days_since := EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400;
    IF days_since > 30 THEN RETURN 0.0; END IF;
    RETURN 1.0 - (days_since / 30.0);
END;
$$;

--------------------------------------------------------------------------------
-- 2. MAIN SCORING FUNCTION (v2)
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION calculate_match_score_v2(
    user_a_id UUID, 
    user_b_id UUID,
    w1 FLOAT DEFAULT 0.35, -- interest_similarity
    w2 FLOAT DEFAULT 0.20, -- community_overlap
    w3 FLOAT DEFAULT 0.25, -- personality_alignment
    w4 FLOAT DEFAULT 0.10, -- activity_score
    w5 FLOAT DEFAULT 0.10  -- freshness
)
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
    ua_interests TEXT[]; ua_data JSONB; ua_created TIMESTAMPTZ;
    ub_interests TEXT[]; ub_data JSONB; ub_active TIMESTAMPTZ; ub_created TIMESTAMPTZ;
    
    s_interests FLOAT := 0;
    s_community FLOAT := 0;
    s_personality FLOAT := 0;
    s_activity FLOAT := 0;
    s_freshness FLOAT := 0;
    
    total_score FLOAT := 0;
    explanation_parts TEXT[] := ARRAY[]::TEXT[];
    common_interests TEXT[];
    common_communities TEXT[];
BEGIN
    -- 1. Get Data
    SELECT interests, onboarding_data, created_at INTO ua_interests, ua_data, ua_created 
    FROM public.profiles WHERE id = user_a_id;
    
    SELECT interests, onboarding_data, last_active_at, created_at INTO ub_interests, ub_data, ub_active, ub_created 
    FROM public.profiles WHERE id = user_b_id;

    -- 2. Calculate Features
    -- Interests
    s_interests := jaccard_similarity(ua_interests, ub_interests);
    SELECT ARRAY(SELECT UNNEST(ua_interests) INTERSECT SELECT UNNEST(ub_interests)) INTO common_interests;
    IF array_length(common_interests, 1) > 0 THEN
        explanation_parts := array_append(explanation_parts, 'You both love ' || array_to_string(common_interests[1:2], ' & '));
    END IF;

    -- Community
    s_community := get_community_overlap(user_a_id, user_b_id);
    SELECT ARRAY(
        SELECT c.name FROM public.communities c
        JOIN public.community_members am ON c.id = am.community_id
        JOIN public.community_members bm ON c.id = bm.community_id
        WHERE am.user_id = user_a_id AND bm.user_id = user_b_id
    ) INTO common_communities;
    IF array_length(common_communities, 1) > 0 THEN
        explanation_parts := array_append(explanation_parts, 'Common communities: ' || array_to_string(common_communities[1:2], ' & '));
    END IF;

    -- Personality (Simple matching for now)
    IF (ua_data->>'dating_intent' = ub_data->>'dating_intent') THEN s_personality := s_personality + 0.4; END IF;
    IF (ua_data->>'social_level' = ub_data->>'social_level') THEN s_personality := s_personality + 0.3; END IF;
    IF (ua_data->>'weekend_vibe' = ub_data->>'weekend_vibe') THEN s_personality := s_personality + 0.3; END IF;
    
    -- Activity & Freshness
    s_activity := get_activity_score(ub_active);
    s_freshness := get_freshness_score(ub_created);

    -- 3. Weighted Score
    total_score := (s_interests * w1) + (s_community * w2) + (s_personality * w3) + (s_activity * w4) + (s_freshness * w5);

    -- 4. Return Output
    RETURN jsonb_build_object(
        'total_score', (total_score * 100)::INT,
        'explanation', array_to_string(explanation_parts, '. '),
        'details', jsonb_build_object(
            'interest_match', (s_interests * 100)::INT,
            'community_overlap', (s_community * 100)::INT,
            'personality_alignment', (s_personality * 100)::INT,
            'activity_score', (s_activity * 100)::INT,
            'freshness', (s_freshness * 100)::INT
        )
    );
END;
$$;

--------------------------------------------------------------------------------
-- 3. REFINED CANDIDATE GENERATION (v2)
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_candidates_v2(
    query_user_id UUID,
    match_mode TEXT DEFAULT 'dating',
    limit_count INTEGER DEFAULT 100
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
    -- Context
    SELECT college_id, gender, looking_for INTO my_college_id, my_gender, my_looking_for
    FROM public.profiles WHERE id = query_user_id;

    -- Already interacted / Reported / Blocked
    SELECT ARRAY(
        SELECT target_id FROM public.analytics_likes WHERE actor_id = query_user_id
        UNION
        SELECT reported_id FROM public.reports WHERE reporter_id = query_user_id
        UNION
        SELECT blocked_id FROM public.blocks WHERE blocker_id = query_user_id
        UNION
        -- Exclude users already in conversation
        SELECT user_id_2 FROM public.conversations WHERE user_id_1 = query_user_id
        UNION
        SELECT user_id_1 FROM public.conversations WHERE user_id_2 = query_user_id
    ) INTO seen_ids;

    RETURN QUERY
    SELECT * FROM public.profiles p
    WHERE
        p.college_id = my_college_id
        AND p.id != query_user_id
        AND NOT (p.id = ANY(seen_ids))
        AND (
            (match_mode = 'dating' AND p.gender = ANY(my_looking_for) AND my_gender = ANY(p.looking_for)) -- Mutual intent
            OR (match_mode = 'social')
        )
    ORDER BY p.last_active_at DESC NULLS LAST, random()
    LIMIT limit_count;
END;
$$;

COMMIT;
