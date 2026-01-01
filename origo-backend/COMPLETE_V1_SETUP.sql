-- ORIGO V1 - COMPLETE SETUP SCRIPT (FIXED)
-- Copy and Paste ALL of this into the Supabase SQL Editor and click RUN.

BEGIN;

--------------------------------------------------------------------------------
-- 0. EXTENSIONS & BASE SCHEMA (Fixes "Relation does not exist" errors)
--------------------------------------------------------------------------------

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Colleges
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('iit', 'nit', 'iim', 'bits', 'private', 'public', 'other')),
  tier INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  college_id UUID REFERENCES colleges(id),
  year_of_study INTEGER,
  gender TEXT,
  pronouns TEXT,
  date_of_birth DATE,
  bio TEXT,
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- V1 Columns
  looking_for TEXT[] DEFAULT '{male, female}'::TEXT[],
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  popularity_score FLOAT DEFAULT 0.5,
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  interests TEXT[] DEFAULT '{}'::TEXT[]
);

-- 3. Conversations (Rizz Chat)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_rizz_active BOOLEAN DEFAULT TRUE,
  messages_sent_by_user1 INTEGER DEFAULT 0,
  messages_sent_by_user2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

-- 4. Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  is_flagged BOOLEAN DEFAULT FALSE
);

-- 5. Connections
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  connection_type TEXT DEFAULT 'friend',
  status TEXT DEFAULT 'pending',
  initiated_by UUID REFERENCES profiles(id),
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

-- 6. Communities & Members
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  college_id UUID REFERENCES colleges(id), 
  category TEXT,
  cover_image_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_urls TEXT[],
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  college_id UUID REFERENCES colleges(id),
  community_id UUID REFERENCES communities(id),
  created_by UUID REFERENCES profiles(id),
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  banner_image_url TEXT,
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  max_attendees INTEGER,
  attendee_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_attendees (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested',
  ticket_id UUID,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

--------------------------------------------------------------------------------
-- 8. SCHEMA EVOLUTION (Ensures columns exist even if table was old)
--------------------------------------------------------------------------------
DO $$ 
BEGIN 
    -- Profiles V1 Columns
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS looking_for TEXT[] DEFAULT '{male, female}'::TEXT[];
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS popularity_score FLOAT DEFAULT 0.5;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}'::TEXT[];

    -- Messages V1 Columns
    ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
END $$;

-- Enable RLS for Base Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Base Policies (Simplified)
DROP POLICY IF EXISTS "Public profiles are viewable by verified users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Colleges viewable" ON colleges;
CREATE POLICY "Colleges viewable" ON colleges FOR SELECT USING (true);

-- Community & Event Policies
DROP POLICY IF EXISTS "Public communities viewable" ON communities;
CREATE POLICY "Public communities viewable" ON communities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public events viewable" ON events;
CREATE POLICY "Public events viewable" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users see own conversations" ON conversations;
CREATE POLICY "Users see own conversations" ON conversations FOR SELECT USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

DROP POLICY IF EXISTS "Users create conversations" ON conversations;
CREATE POLICY "Users create conversations" ON conversations FOR INSERT WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

DROP POLICY IF EXISTS "Users see own messages" ON messages;
CREATE POLICY "Users see own messages" ON messages FOR SELECT USING (
    sender_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM conversations WHERE id = messages.conversation_id AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid()))
);

DROP POLICY IF EXISTS "Users send messages" ON messages;
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

--------------------------------------------------------------------------------
-- 1. ANALYTICS & LOGGING
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    view_duration_seconds INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT CHECK (action_type IN ('like', 'pass', 'superlike', 'undo')) NOT NULL,
    source TEXT DEFAULT 'discover_feed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.analytics_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can log their own views" ON public.analytics_profile_views;
CREATE POLICY "Users can log their own views" ON public.analytics_profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);

DROP POLICY IF EXISTS "Users can log their own likes" ON public.analytics_likes;
CREATE POLICY "Users can log their own likes" ON public.analytics_likes FOR INSERT WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can see who viewed them" ON public.analytics_profile_views;
CREATE POLICY "Users can see who viewed them" ON public.analytics_profile_views FOR SELECT USING (auth.uid() = viewed_id);

--------------------------------------------------------------------------------
-- 2. SAFETY (BLOCKS)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can block others" ON public.blocks;
CREATE POLICY "Users can block others" ON public.blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can see their blocks" ON public.blocks;
CREATE POLICY "Users can see their blocks" ON public.blocks FOR SELECT USING (auth.uid() = blocker_id);

--------------------------------------------------------------------------------
-- 3. SCORING HELPERS
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION jaccard_similarity(arr1 TEXT[], arr2 TEXT[])
RETURNS FLOAT LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    intersection_count INT;
    union_count INT;
BEGIN
    IF arr1 IS NULL OR arr2 IS NULL THEN RETURN 0.0; END IF;
    SELECT COUNT(*) INTO intersection_count FROM (SELECT UNNEST(arr1) INTERSECT SELECT UNNEST(arr2)) t;
    SELECT COUNT(*) INTO union_count FROM (SELECT UNNEST(arr1) UNION SELECT UNNEST(arr2)) t;
    IF union_count = 0 THEN RETURN 0.0; END IF;
    RETURN intersection_count::FLOAT / union_count::FLOAT;
END;
$$;

--------------------------------------------------------------------------------
-- 4. CANDIDATE GENERATION (V1)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_candidates_v1(
  query_user_id UUID DEFAULT auth.uid(),
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
  SELECT college_id, gender, looking_for INTO my_college_id, my_gender, my_looking_for
  FROM public.profiles WHERE id = query_user_id;

  -- B. Get Blocked/Seen IDs
  SELECT ARRAY(
    SELECT target_id FROM public.analytics_likes WHERE actor_id = query_user_id
    UNION
    SELECT reported_id FROM public.reports WHERE reporter_id = query_user_id
    UNION
    SELECT blocked_id FROM public.blocks WHERE blocker_id = query_user_id
  ) INTO seen_ids;

  -- C. Return Candidates
  RETURN QUERY
  SELECT * FROM public.profiles p
  WHERE
    p.college_id = my_college_id
    AND p.id != query_user_id
    AND NOT (p.id = ANY(seen_ids))
    AND (
       (match_mode = 'dating' AND p.gender = ANY(my_looking_for))
       OR (match_mode = 'social')
    )
  ORDER BY random()
  LIMIT limit_count;
END;
$$;

--------------------------------------------------------------------------------
-- 5. SCORING LOGIC
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_match_score(user_a_id UUID, user_b_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
  score FLOAT := 0;
  ua_interests TEXT[]; ua_data JSONB;
  ub_interests TEXT[]; ub_data JSONB;
  score_interests FLOAT := 0;
  score_personality FLOAT := 0;
  score_community FLOAT := 0.5; -- Placeholder
  w_interests FLOAT := 0.40;
  w_personality FLOAT := 0.30;
  w_community FLOAT := 0.30;
BEGIN
  SELECT interests, onboarding_data INTO ua_interests, ua_data FROM public.profiles WHERE id = user_a_id;
  SELECT interests, onboarding_data INTO ub_interests, ub_data FROM public.profiles WHERE id = user_b_id;

  score_interests := jaccard_similarity(ua_interests, ub_interests);
  
  IF (ua_data->>'dating_intent' = ub_data->>'dating_intent') THEN score_personality := score_personality + 0.4; END IF;
  IF (ua_data->>'social_level' = ub_data->>'social_level') THEN score_personality := score_personality + 0.3; END IF;
  IF (ua_data->>'weekend_vibe' = ub_data->>'weekend_vibe') THEN score_personality := score_personality + 0.3; END IF;

  score := (score_interests * w_interests) + (score_personality * w_personality) + (score_community * w_community);
  
  RETURN jsonb_build_object(
    'total_score', (score * 100)::INT,
    'details', jsonb_build_object(
      'interest_match', (score_interests * 100)::INT,
      'personality_match', (score_personality * 100)::INT
    )
  );
END;
$$;

--------------------------------------------------------------------------------
-- 6. API ENDPOINT (RPC)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_scored_matches_v1(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (user_data JSONB, score_data JSONB)
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
  FOR candidate IN SELECT * FROM get_candidates_v1(uid, 'dating', 50) 
  LOOP
    s := calculate_match_score(uid, candidate.id);
    SELECT name INTO c_name FROM public.colleges WHERE id = candidate.college_id;
    full_data := to_jsonb(candidate) || jsonb_build_object('college', jsonb_build_object('name', c_name));
    user_data := full_data;
    score_data := s;
    RETURN NEXT;
  END LOOP;
END;
$$;

--------------------------------------------------------------------------------
-- 7. ENGAGEMENT (Recaps)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    stats JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.recaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own recaps" ON public.recaps;
CREATE POLICY "Users see own recaps" ON public.recaps FOR SELECT USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 9. AUTH TRIGGER (Auto-create Profile)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, college_id, onboarding_data)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    NULL, -- college_id set later or via metadata lookup if advanced
    jsonb_build_object('college_domain', new.raw_user_meta_data->>'college_domain')
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

--------------------------------------------------------------------------------
-- 10. BACKFILL (Fix for existing users who missed the trigger)
--------------------------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name, onboarding_data)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Student'), 
    jsonb_build_object('college_domain', raw_user_meta_data->>'college_domain')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

COMMIT;
