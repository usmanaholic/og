/*
  # OGs Support Hub Database Schema

  1. New Tables
    - `votes` - Tracks support votes with user identification
      - `id` (uuid, primary key)
      - `user_id` (text, IP hash or unique identifier)
      - `created_at` (timestamp)
    
    - `experiences` - Student experiences and testimonials
      - `id` (uuid, primary key)
      - `name` (text, nullable for anonymous submissions)
      - `experience` (text, required)
      - `created_at` (timestamp)
    
    - `polls` - Poll responses for quick questions
      - `id` (uuid, primary key)
      - `question` (text)
      - `option` (text: Yes/No)
      - `user_id` (text)
      - `created_at` (timestamp)
    
    - `messages` - Support messages wall
      - `id` (uuid, primary key)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `ogs` - OG profiles for spotlight section
      - `id` (uuid, primary key)
      - `name` (text)
      - `dept` (text)
      - `quote` (text)
      - `photo_url` (text, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous users to read and insert data
    - Restrict sensitive operations appropriately

  3. Sample Data
    - Pre-populate OGs table with sample profiles
    - Add initial poll question about OG abandonment
*/

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  experience text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read experiences"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert experiences"
  ON experiences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT 'Do you think OGs abandoned freshmen?',
  option text NOT NULL CHECK (option IN ('Yes', 'No')),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read polls"
  ON polls
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert poll responses"
  ON polls
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- OGs table
CREATE TABLE IF NOT EXISTS ogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dept text NOT NULL,
  quote text NOT NULL,
  photo_url text
);

ALTER TABLE ogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read OG profiles"
  ON ogs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample OG data
INSERT INTO ogs (name, dept, quote, photo_url) VALUES
('Sarah Khan', 'Computer Science', 'Always here to guide you through your NUST journey!', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
('Ahmed Ali', 'Electrical Engineering', 'Your success is our mission. We got your back!', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
('Fatima Sheikh', 'Business Administration', 'From day one to graduation - we are with you!', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
('Hassan Malik', 'Mechanical Engineering', 'Making NUST feel like home, one student at a time.', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
('Ayesha Rehman', 'Architecture', 'Building bridges between seniors and freshmen.', 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
('Bilal Ahmad', 'Civil Engineering', 'Dedicated to making your transition smooth and memorable.', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON experiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_polls_question ON polls(question);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);