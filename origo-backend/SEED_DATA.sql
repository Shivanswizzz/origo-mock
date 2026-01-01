-- SEED DATA FOR V1 LAUNCH
-- Run this AFTER running COMPLETE_V1_SETUP.sql

BEGIN;

-- 1. Insert Colleges
INSERT INTO public.colleges (name, domain, location, type, tier, is_verified) VALUES
('BITS Pilani', 'bits-pilani.ac.in', 'Pilani, Rajasthan', 'bits', 1, TRUE),
('IIT Delhi', 'iitd.ac.in', 'New Delhi', 'iit', 1, TRUE),
('IIT Bombay', 'iitb.ac.in', 'Mumbai', 'iit', 1, TRUE),
('Manipal (MAHE)', 'manipal.edu', 'Manipal', 'private', 2, TRUE),
('Delhi University', 'du.ac.in', 'New Delhi', 'public', 2, TRUE),
('VIT Vellore', 'vit.ac.in', 'Vellore', 'private', 2, TRUE)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Communities
INSERT INTO public.communities (name, description, category, member_count, is_private) VALUES
('BITS Quant Club', 'For finance and algo trading enthusiasts.', 'Finance', 142, FALSE),
('IITD Debating Soc', 'The official debating society of IIT Delhi.', 'Debate', 89, FALSE),
('Startup Network', 'Connect with student founders.', 'Startup', 310, FALSE),
('Anime & Manga', 'The biggest weeb community on campus.', 'Social', 520, FALSE)
ON CONFLICT DO NOTHING;

-- 3. Insert Events
INSERT INTO public.events (title, description, event_date, location, ticket_price, attendee_count) VALUES
('Oasis 2025 - Rock Night', 'The legendary rock performance at BITS Pilani.', NOW() + INTERVAL '10 days', 'Rotunda, Pilani', 499.00, 1500),
('Rendezvous Pronite', 'Star night featuring top artists.', NOW() + INTERVAL '15 days', 'OAT, IIT Delhi', 899.00, 2500),
('Hackathon: Code required', '24 hour hackathon.', NOW() + INTERVAL '5 days', 'LHC 101', 0.00, 100)
ON CONFLICT DO NOTHING;

-- 4. Insert Mock Profiles (So Discover Feed isn't empty)
-- Note: We need to get a valid college_id first
DO $$
DECLARE
    bits_id UUID;
    iitd_id UUID;
BEGIN
    SELECT id INTO bits_id FROM public.colleges WHERE name = 'BITS Pilani';
    SELECT id INTO iitd_id FROM public.colleges WHERE name = 'IIT Delhi';

    -- Mock User 1
    INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'arya@bits-pilani.ac.in') ON CONFLICT DO NOTHING;
    INSERT INTO public.profiles (id, email, full_name, college_id, gender, bio, profile_photo_url, looking_for, popularity_score, interests, onboarding_data)
    VALUES (
        '00000000-0000-0000-0000-000000000001',
        'arya@bits-pilani.ac.in',
        'Arya Stark',
        bits_id,
        'female',
        'A girl has no name, but she likes coding and coffee.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Arya',
        '{male}',
        0.95,
        '{coding, startups, coffee, got}',
        '{"dating_intent": "relationship", "social_level": "extrovert", "weekend_vibe": "party"}'
    ) ON CONFLICT (id) DO NOTHING;

    -- Mock User 2
    INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000002', 'jon@iitd.ac.in') ON CONFLICT DO NOTHING;
    INSERT INTO public.profiles (id, email, full_name, college_id, gender, bio, profile_photo_url, looking_for, popularity_score, interests, onboarding_data)
    VALUES (
        '00000000-0000-0000-0000-000000000002',
        'jon@iitd.ac.in',
        'Jon Snow',
        iitd_id,
        'male',
        'I know nothing except Python.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jon',
        '{female}',
        0.88,
        '{coding, winter, dogs, hiking}',
        '{"dating_intent": "casual", "social_level": "introvert", "weekend_vibe": "chill"}'
    ) ON CONFLICT (id) DO NOTHING;
    
     -- Mock User 3
    INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000003', 'sansa@bits-pilani.ac.in') ON CONFLICT DO NOTHING;
    INSERT INTO public.profiles (id, email, full_name, college_id, gender, bio, profile_photo_url, looking_for, popularity_score, interests, onboarding_data)
    VALUES (
        '00000000-0000-0000-0000-000000000003',
        'sansa@bits-pilani.ac.in',
        'Sansa Stark',
        bits_id,
        'female',
        'Queen in the North. Looking for a serious match.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sansa',
        '{male}',
        0.92,
        '{politics, fashion, travel}',
        '{"dating_intent": "marriage", "social_level": "ambivert", "weekend_vibe": "chill"}'
    ) ON CONFLICT (id) DO NOTHING;

END $$;

COMMIT;
