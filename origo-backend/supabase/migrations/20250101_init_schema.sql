-- Origo Backend Schema - 2025-01-01
-- Includes: Core Auth, Profiles, Communities, Events, Rizz Chat, Shipping, ML Vectors
-- Security: RLS Policies, Audit Logs, Triggers

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------------------------
-- 1. CORE TABLES (Users, Colleges, Metadata)
-----------------------------------------------------------------------------

-- Colleges Table
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE NOT NULL, -- e.g., iitd.ac.in
  logo_url TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('iit', 'nit', 'iim', 'bits', 'private', 'public', 'other')),
  tier INTEGER CHECK (tier BETWEEN 1 AND 3),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_colleges_domain ON colleges(domain);

-- Profiles Table (Linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  college_id UUID REFERENCES colleges(id),
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 6),
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  pronouns TEXT,
  date_of_birth DATE, -- Made nullable for initial signup flexibility
  bio TEXT CHECK (LENGTH(bio) <= 500),
  profile_photo_url TEXT,
  cover_photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected')),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profiles_college ON profiles(college_id);
CREATE INDEX idx_profiles_verified ON profiles(is_verified);
CREATE INDEX idx_profiles_premium ON profiles(is_premium);

-- Interests Metadata
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_interests (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, interest_id)
);

-----------------------------------------------------------------------------
-- 2. MATCHING & CONNECTIONS
-----------------------------------------------------------------------------

-- Matching Questions
CREATE TABLE matching_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('slider', 'mcq', 'multiple_select')),
  options JSONB,
  weight FLOAT DEFAULT 1.0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Answers to Matching Questions
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES matching_questions(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Connections (Friends/Matches)
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  connection_type TEXT CHECK (connection_type IN ('friend', 'date', 'both')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  initiated_by UUID REFERENCES profiles(id),
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id_1 < user_id_2), -- Prevent duplicates and ensure ordering
  UNIQUE(user_id_1, user_id_2)
);
CREATE INDEX idx_connections_user1 ON connections(user_id_1);
CREATE INDEX idx_connections_user2 ON connections(user_id_2);
CREATE INDEX idx_connections_status ON connections(status);

-----------------------------------------------------------------------------
-- 3. RIZZ CHAT (MESSAGING)
-----------------------------------------------------------------------------

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_rizz_active BOOLEAN DEFAULT TRUE,
  messages_sent_by_user1 INTEGER DEFAULT 0,
  messages_sent_by_user2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id_1 < user_id_2),
  UNIQUE(user_id_1, user_id_2)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-----------------------------------------------------------------------------
-- 4. COMMUNITIES & EVENTS
-----------------------------------------------------------------------------

CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  college_id UUID REFERENCES colleges(id), -- NULL means global
  category TEXT,
  cover_image_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_members (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_urls TEXT[],
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
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

CREATE TABLE event_attendees (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'going')),
  ticket_id UUID,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-----------------------------------------------------------------------------
-- 5. SHIPPING & PAYMENTS
-----------------------------------------------------------------------------

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('premium_subscription', 'ship', 'profile_boost', 'event_ticket', 'iap')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_gateway TEXT,
  gateway_transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_user ON transactions(user_id);

CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT CHECK (LENGTH(reason) <= 500),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'revealed', 'connected', 'declined')),
  payment_id UUID REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Basic constraint: Person A != Person B, and Shipper != Person A or B
  CHECK (user_id_1 <> user_id_2 AND shipper_id <> user_id_1 AND shipper_id <> user_id_2)
);
CREATE INDEX idx_ships_user1 ON ships(user_id_1);
CREATE INDEX idx_ships_user2 ON ships(user_id_2);

-----------------------------------------------------------------------------
-- 6. SYSTEM (Notifications, Verification, Logs, ML)
-----------------------------------------------------------------------------

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);

CREATE TABLE verification_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'under_review', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES profiles(id),
  review_notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- ML Vectors (pgvector)
CREATE TABLE ml_user_vectors (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  vector VECTOR(128), 
  metadata JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON ml_user_vectors USING ivfflat (vector vector_cosine_ops);

CREATE TABLE ml_match_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recommended_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  compatibility_score FLOAT NOT NULL CHECK (compatibility_score BETWEEN 0 AND 100),
  confidence FLOAT,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recommended_user_id)
);

-----------------------------------------------------------------------------
-- 7. STORAGE BUCKETS
-----------------------------------------------------------------------------
-- Note: Buckets often need to be created via API or Dashboard in some Supabase versions, 
-- but we define policies assuming they exist.
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', TRUE),
  ('cover-photos', 'cover-photos', TRUE),
  ('community-covers', 'community-covers', TRUE),
  ('event-banners', 'event-banners', TRUE),
  ('verification-uploads', 'verification-uploads', FALSE),
  ('chat-images', 'chat-images', FALSE)
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------------------------
-- 8. RLS POLICIES (Row Level Security)
-----------------------------------------------------------------------------

-- ENABLE RLS ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by verified users" ON profiles
  FOR SELECT USING (true); -- Simplified for MVP: Viewable by anyone authenticated ideally. For now true.

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Colleges: Public Read Only
CREATE POLICY "Colleges are viewable by everyone" ON colleges
  FOR SELECT USING (true);

-- Interests: Public Read Only
CREATE POLICY "Interests are viewable by everyone" ON interests
  FOR SELECT USING (true);

-- User Interests: Public Read, Own Write
CREATE POLICY "User interests viewable" ON user_interests
  FOR SELECT USING (true);
CREATE POLICY "Users manage own interests" ON user_interests
  FOR ALL USING (auth.uid() = user_id);

-- Messages & Conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = messages.conversation_id 
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Communities
CREATE POLICY "Public communities are viewable" ON communities
  FOR SELECT USING (is_private = FALSE);
CREATE POLICY "Members can view private communities" ON communities
  FOR SELECT USING (
    is_private = TRUE AND EXISTS (
      SELECT 1 FROM community_members WHERE community_id = communities.id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Auth users can create communities" ON communities
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Ships
CREATE POLICY "Users can see ships involving them" ON ships
  FOR SELECT USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid() OR shipper_id = auth.uid());
CREATE POLICY "Users can create ships" ON ships
  FOR INSERT WITH CHECK (shipper_id = auth.uid());

-- Transactions (Private)
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

-- Storage Policies
CREATE POLICY "Public profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can upload own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-----------------------------------------------------------------------------
-- 9. TRIGGERS & FUNCTIONS
-----------------------------------------------------------------------------

-- Function: update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: log_audit
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, changes)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_profile_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- Function: check_rizz_limit (Rizz In 5 Enforcement)
CREATE OR REPLACE FUNCTION check_rizz_limit()
RETURNS TRIGGER AS $$
DECLARE
  conversation RECORD;
  message_count INTEGER;
BEGIN
  SELECT * INTO conversation FROM conversations WHERE id = NEW.conversation_id;
  
  -- If conversation doesn't exist or Rizz inactive, allow.
  IF conversation IS NULL OR NOT conversation.is_rizz_active THEN
    RETURN NEW;
  END IF;
  
  message_count := CASE 
    WHEN NEW.sender_id = conversation.user_id_1 THEN conversation.messages_sent_by_user1
    ELSE conversation.messages_sent_by_user2
  END;
  
  IF message_count >= 5 THEN
    RAISE EXCEPTION 'Rizz limit reached. Upgrade or wait for response.';
  END IF;
  
  -- Update message count atomically
  IF NEW.sender_id = conversation.user_id_1 THEN
    UPDATE conversations SET messages_sent_by_user1 = messages_sent_by_user1 + 1 WHERE id = NEW.conversation_id;
  ELSE
    UPDATE conversations SET messages_sent_by_user2 = messages_sent_by_user2 + 1 WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_rizz_limit
  BEFORE INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION check_rizz_limit();

