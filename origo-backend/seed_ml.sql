-- Seed Data for Origo Demo (ML & Pages)
-- Run this in Supabase SQL Editor

-- 1. Create some dummy Communities so the page isn't empty
INSERT INTO communities (name, description, category, member_count, image_url)
VALUES 
('Tech Innovators', 'For coding wizards and hackathon enthusiasts.', 'Tech', 120, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80'),
('Shutterbugs', 'Photography club of the campus.', 'Arts', 85, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80'),
('Dunk Kings', 'Basketball lovers unite.', 'Sports', 200, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;

-- 2. Create some dummy Events
INSERT INTO events (title, description, event_date, location, ticket_price, max_attendees, attendee_count)
VALUES
('Campus Hackathon 2025', '24-hour coding marathon.', NOW() + INTERVAL '5 days', 'Main Audi', 0, 500, 45),
('Music Night', 'Open mic and acoustic vibes.', NOW() + INTERVAL '2 days', 'Cafeteria Lawn', 100, 200, 80),
('Inter-Hostel Cricket', 'The ultimate showdown.', NOW() + INTERVAL '10 days', 'Sports Ground', 0, 1000, 150)
ON CONFLICT DO NOTHING;

-- 3. Create Dummy Users with ML ONBOARDING DATA
-- Note: We need auth.users entries first, but since we can't easily seed auth.users via SQL without admin API,
-- we will just insert into PROFILES assuming these IDs exist or we can use generic UUIDs if RLS allows (likely strictly checks auth).
-- LIMITATION: You cannot easily seed "Auth Users" purely via SQL. 
-- WORKAROUND: For the demo, you should manually create 2-3 users via the Signup Page. 
-- HOWEVER, to simulate "Other Users" in the Discovery Feed, we CAN insert fake profiles if RLS allows reading them.

-- Let's try inserting 3 "Fake Profiles" that are just for display (Matching candidates).
-- Using random UUIDs. RLS policy typically allows "SELECT * FROM profiles", so they should be visible.

INSERT INTO profiles (id, email, full_name, college_id, year_of_study, bio, gender, onboarding_data, is_verified)
VALUES
(
  gen_random_uuid(), 
  'bot1@demo.com', 
  'Aarav Sharma', 
  (SELECT id FROM colleges LIMIT 1), 
  3, 
  'Loves coding and chai.', 
  'male',
  '{
    "social_level": "Homebody",
    "weekend_vibe": "Gaming/Chill",
    "recharge": "Alone",
    "communication_style": "Texting",
    "dating_intent": "Serious"
  }'::jsonb,
  true
),
(
  gen_random_uuid(), 
  'bot2@demo.com', 
  'Riya Patel', 
  (SELECT id FROM colleges LIMIT 1), 
  2, 
  'Social butterfly, love parties!', 
  'female',
  '{
    "social_level": "Social butterfly",
    "weekend_vibe": "Party",
    "recharge": "With People",
    "communication_style": "In-person",
    "dating_intent": "Casual"
  }'::jsonb,
  true
),
(
  gen_random_uuid(), 
  'bot3@demo.com', 
  'Vikram Singh', 
  (SELECT id FROM colleges LIMIT 1), 
  4, 
  'Gym rat and disciplined.', 
  'male',
  '{
    "social_level": "Ambivert",
    "weekend_vibe": "Outdoor",
    "recharge": "Both",
    "communication_style": "Calls",
    "dating_intent": "Friendship"
  }'::jsonb,
  true
);

-- Note: These "Fake Profiles" wont have Auth Accounts, so they cant login. 
-- But they will appear in your "Discover Feed" and "Matching Algorithm" as potential matches.
