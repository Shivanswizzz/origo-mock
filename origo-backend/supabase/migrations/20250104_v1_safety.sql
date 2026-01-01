-- Migration: V1 Safety & Privacy Layer
-- Purpose: Content Filtering & User Blocking

-- 1. Blocks Table
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can block others" ON public.blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can see their blocks" ON public.blocks FOR SELECT USING (auth.uid() = blocker_id);


-- 2. Content Moderation Trigger Function
-- Simulating "AI Moderation" with Regex for V1 MVP
CREATE OR REPLACE FUNCTION check_message_safety()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    bad_patterns TEXT[] := ARRAY['badword1', 'badword2', 'idiot', 'scam']; -- Placeholder list
    p TEXT;
BEGIN
    -- Check for bad words (Case insensitive)
    FOREACH p IN ARRAY bad_patterns
    LOOP
        IF NEW.content ~* p THEN
            -- Option A: Block the insert (Hard Filter)
            -- RAISE EXCEPTION 'Message contains prohibited content.';
            
            -- Option B: Flag it (Soft Filter)
            NEW.is_flagged := TRUE;
            -- We might want to save it but hide it? 
            -- For MVP, let's just FLAG it so we can filter in UI or Admin panel.
            RETURN NEW; 
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- 3. Add flagged column to messages if not exists
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;

-- 4. Apply Trigger
DROP TRIGGER IF EXISTS tr_check_safety ON public.messages;
CREATE TRIGGER tr_check_safety
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION check_message_safety();

-- 5. Update Candidate Generation to Respect Blocks
-- We redefine the function to include the blocks table in "seen_ids"
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
  SELECT college_id, gender, looking_for 
  INTO my_college_id, my_gender, my_looking_for
  FROM public.profiles
  WHERE id = query_user_id;

  -- B. Get Blocked/Seen IDs (Updated to include Blocks)
  SELECT ARRAY(
    SELECT target_id FROM public.analytics_likes WHERE actor_id = query_user_id
    UNION
    SELECT reported_id FROM public.reports WHERE reporter_id = query_user_id
    UNION
    SELECT blocked_id FROM public.blocks WHERE blocker_id = query_user_id
  ) INTO seen_ids;

  -- C. Return Candidates
  RETURN QUERY
  SELECT *
  FROM public.profiles p
  WHERE
    p.college_id = my_college_id
    AND p.id != query_user_id
    AND NOT (p.id = ANY(seen_ids))
    AND (
       (match_mode = 'dating' AND p.gender = ANY(my_looking_for))
       OR
       (match_mode = 'social')
    )
  ORDER BY 
    random()
  LIMIT limit_count;
END;
$$;
