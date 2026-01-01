-- Migration: V1 Engagement Hooks
-- Purpose: Recaps, Leaderboards, and "Whos Viewed Me" support

-- 1. Weekly Recaps Table
CREATE TABLE IF NOT EXISTS public.recaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    stats JSONB NOT NULL, -- { messages_sent: 50, profile_views: 120, best_match: "Name" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.recaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own recaps" ON public.recaps FOR SELECT USING (auth.uid() = user_id);

-- 2. Generate Recap Function (To be called by Cron or manually for testing)
CREATE OR REPLACE FUNCTION generate_weekly_recap(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    start_d DATE := CURRENT_DATE - INTERVAL '7 days';
    end_d DATE := CURRENT_DATE;
    msg_count INT;
    view_count INT;
    like_count INT;
BEGIN
    -- Count Messages
    SELECT COUNT(*) INTO msg_count FROM analytics_messages 
    WHERE sender_id = target_user_id AND created_at >= start_d;
    
    -- Count Views Received
    SELECT COUNT(*) INTO view_count FROM analytics_profile_views 
    WHERE viewed_id = target_user_id AND created_at >= start_d;
    
    -- Count Likes Received
    SELECT COUNT(*) INTO like_count FROM analytics_likes 
    WHERE target_id = target_user_id AND action_type = 'like' AND created_at >= start_d;
    
    -- Insert Recap
    INSERT INTO public.recaps (user_id, period_start, period_end, stats)
    VALUES (
        target_user_id, 
        start_d, 
        end_d, 
        jsonb_build_object(
            'messages_sent', msg_count,
            'profile_views', view_count,
            'likes_received', like_count
        )
    );
END;
$$;

-- 3. Leaderboard Function (Popularity)
-- Returns top 10 users by popularity_score
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    college_name TEXT,
    score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.full_name, c.name, p.popularity_score
    FROM profiles p
    JOIN colleges c ON p.college_id = c.id
    ORDER BY p.popularity_score DESC
    LIMIT 10;
END;
$$;
