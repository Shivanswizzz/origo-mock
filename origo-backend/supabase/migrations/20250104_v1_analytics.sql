-- Migration: V1 Analytics & Logging
-- Created: 2025-01-04
-- Purpose: Track user behavior as per V1 Launch Spec (Logging > Blackbox)

-- 1. Profile Views Table
CREATE TABLE IF NOT EXISTS public.analytics_profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    view_duration_seconds INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb, -- Store "source" (feed/search) etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Likes / Actions Table (Explicit logging separate from connections)
CREATE TABLE IF NOT EXISTS public.analytics_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT CHECK (action_type IN ('like', 'pass', 'superlike', 'undo')) NOT NULL,
    source TEXT DEFAULT 'discover_feed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Safety/Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.analytics_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Users can log their own actions
CREATE POLICY "Users can log their own views" ON public.analytics_profile_views
    FOR INSERT WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "Users can log their own likes" ON public.analytics_likes
    FOR INSERT WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can see who viewed them (Premium Feature - implementation later, allowing read for now if own ID is viewed_id)
CREATE POLICY "Users can see who viewed them" ON public.analytics_profile_views
    FOR SELECT USING (auth.uid() = viewed_id);

-- Admins (Service Role) have full access by default
