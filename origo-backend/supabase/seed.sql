-- Seed Data for Origo
-- Includes: Colleges, Interests, and 20 Demo Users

-- 1. COLLEGES
INSERT INTO colleges (name, domain, type, location, tier, is_verified) VALUES
('IIT Delhi', 'iitd.ac.in', 'iit', 'New Delhi', 1, TRUE),
('IIT Bombay', 'iitb.ac.in', 'iit', 'Mumbai', 1, TRUE),
('BITS Pilani', 'bits-pilani.ac.in', 'bits', 'Pilani', 1, TRUE),
('NIT Trichy', 'nitt.edu', 'nit', 'Tiruchirappalli', 1, TRUE),
('Delhi University', 'du.ac.in', 'public', 'New Delhi', 2, TRUE),
('VIT Vellore', 'vit.ac.in', 'private', 'Vellore', 2, TRUE),
('SRM University', 'srmist.edu.in', 'private', 'Chennai', 2, TRUE),
('Manipal (MAHE)', 'manipal.edu', 'private', 'Manipal', 2, TRUE),
('Amity University', 'amity.edu', 'private', 'Noida', 3, TRUE),
('Thapar University', 'thapar.edu', 'private', 'Patiala', 2, TRUE)
ON CONFLICT (domain) DO NOTHING;

-- 2. INTERESTS
INSERT INTO interests (name, category, icon) VALUES
('Coding', 'Tech', 'Code'),
('Startup', 'Tech', 'Rocket'),
('Design', 'Creative', 'Palette'),
('Photography', 'Creative', 'Camera'),
('Guitar', 'Music', 'Music'),
('EDM', 'Music', 'Headphones'),
('Football', 'Sports', 'Activity'),
('Cricket', 'Sports', 'Activity'),
('Yoga', 'Lifestyle', 'Sunset'),
('Travel', 'Lifestyle', 'Map'),
('Anime', 'Entertainment', 'Tv'),
('Gaming', 'Entertainment', 'Gamepad'),
('Reading', 'Intellectual', 'Book'),
('Debating', 'Intellectual', 'Mic'),
('Foodie', 'Lifestyle', 'Coffee')
ON CONFLICT (name) DO NOTHING;

-- 3. USERS (Using a loop logic or direct inserts if SQL allows, explicit inserts are safer for compatibility)
-- Note: In a real scenario, we can't easily insert into auth.users directly via seed.sql due to hashing security.
-- Ideally, these should be created via the Auth API. 
-- However, for 'profiles', we can insert dummy data IF we assume these IDs exist or if we just populate 'profiles' for display purposes 
-- (but they won't be able to login unless auth.users has matches).
-- STRATEGY: We will insert into 'profiles' ONLY. These will be "Visible" users but not loggable unless we create auth users manually.
-- This is fine for the "Discover" feed testing.

INSERT INTO profiles (id, email, full_name, college_id, year_of_study, gender, bio, is_verified, account_status) VALUES
(gen_random_uuid(), 'aarav@iitd.ac.in', 'Aarav Sharma', (SELECT id FROM colleges WHERE domain='iitd.ac.in'), 3, 'male', 'Building the next big thing in AI. Love hackathons and chai.', TRUE, 'active'),
(gen_random_uuid(), 'priya@iitb.ac.in', 'Priya Patel', (SELECT id FROM colleges WHERE domain='iitb.ac.in'), 2, 'female', 'Designer by day, gamer by night. Looking for a co-founder.', TRUE, 'active'),
(gen_random_uuid(), 'ROHAN@bits-pilani.ac.in', 'Rohan Mehta', (SELECT id FROM colleges WHERE domain='bits-pilani.ac.in'), 4, 'male', 'Full stack dev. React is life. Caffeine addict.', TRUE, 'active'),
(gen_random_uuid(), 'isha@nitt.edu', 'Isha Gupta', (SELECT id FROM colleges WHERE domain='nitt.edu'), 1, 'female', 'Explorer. Photographer. Just started my coding journey.', TRUE, 'active'),
(gen_random_uuid(), 'vikram@vit.ac.in', 'Vikram Singh', (SELECT id FROM colleges WHERE domain='vit.ac.in'), 3, 'male', 'Fitness freak. Gym rat. Front-end wizard.', TRUE, 'active'),
(gen_random_uuid(), 'neha@du.ac.in', 'Neha Verma', (SELECT id FROM colleges WHERE domain='du.ac.in'), 2, 'female', 'Literature student with a passion for tech. Writing code poetry.', TRUE, 'active'),
(gen_random_uuid(), 'karan@srmist.edu.in', 'Karan Kumar', (SELECT id FROM colleges WHERE domain='srmist.edu.in'), 4, 'male', 'Blockchain enthusiast. HODLing since 2020.', TRUE, 'active'),
(gen_random_uuid(), 'sara@manipal.edu', 'Sara Ali', (SELECT id FROM colleges WHERE domain='manipal.edu'), 3, 'female', 'Med student who loves to code. Weird combo, I know.', TRUE, 'active'),
(gen_random_uuid(), 'arjun@amity.edu', 'Arjun Reddy', (SELECT id FROM colleges WHERE domain='amity.edu'), 1, 'male', 'Just here to make friends and build cool stuff.', FALSE, 'active'),
(gen_random_uuid(), 'kavya@thapar.edu', 'Kavya Singh', (SELECT id FROM colleges WHERE domain='thapar.edu'), 2, 'female', 'Music is my escape. Guitarist in a college band.', TRUE, 'active'),
(gen_random_uuid(), 'rahul@iitd.ac.in', 'Rahul Malhotra', (SELECT id FROM colleges WHERE domain='iitd.ac.in'), 4, 'male', 'Consulting aspirant. Case studies and coffee.', TRUE, 'active'),
(gen_random_uuid(), 'ananya@iitb.ac.in', 'Ananya Desai', (SELECT id FROM colleges WHERE domain='iitb.ac.in'), 3, 'female', 'Dancer. Dreamer. Doer.', TRUE, 'active'),
(gen_random_uuid(), 'yash@bits-pilani.ac.in', 'Yash Oza', (SELECT id FROM colleges WHERE domain='bits-pilani.ac.in'), 2, 'male', 'Physics nerd. Astrophysics is cool.', TRUE, 'active'),
(gen_random_uuid(), 'tanvi@nitt.edu', 'Tanvi Shah', (SELECT id FROM colleges WHERE domain='nitt.edu'), 3, 'female', 'Product Management. User empathy is everything.', TRUE, 'active'),
(gen_random_uuid(), 'dev@vit.ac.in', 'Dev Anand', (SELECT id FROM colleges WHERE domain='vit.ac.in'), 1, 'male', 'Fresher. Looking for guidance.', FALSE, 'active'),
(gen_random_uuid(), 'pooja@du.ac.in', 'Pooja Rani', (SELECT id FROM colleges WHERE domain='du.ac.in'), 2, 'female', 'Political Science major. Debate club president.', TRUE, 'active'),
(gen_random_uuid(), 'aditya@srmist.edu.in', 'Aditya Roy', (SELECT id FROM colleges WHERE domain='srmist.edu.in'), 3, 'male', 'Movies and popcorn. Aspiring filmmaker.', TRUE, 'active'),
(gen_random_uuid(), 'meera@manipal.edu', 'Meera Iyer', (SELECT id FROM colleges WHERE domain='manipal.edu'), 4, 'female', 'Psychology student. I can read your mind (maybe).', TRUE, 'active'),
(gen_random_uuid(), 'sid@amity.edu', 'Siddharth Jain', (SELECT id FROM colleges WHERE domain='amity.edu'), 2, 'male', 'Marketing major. Growth hacking my life.', TRUE, 'active'),
(gen_random_uuid(), 'riya@thapar.edu', 'Riya Kapoor', (SELECT id FROM colleges WHERE domain='thapar.edu'), 3, 'female', 'Fashion design. Creating trends, not following them.', TRUE, 'active');

