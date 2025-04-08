-- Create tables for Chrome extension integration

-- Table for storing Chrome extension metadata
CREATE TABLE IF NOT EXISTS chrome_extension_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  extension_id TEXT NOT NULL,
  version TEXT NOT NULL,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, extension_id)
);

-- Table for storing extension recording metadata
CREATE TABLE IF NOT EXISTS extension_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
  zoom_meeting_id TEXT REFERENCES zoom_meetings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  file_size INTEGER, -- in bytes
  file_path TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'processing', -- processing, ready, error
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing extension recording participants
CREATE TABLE IF NOT EXISTS extension_recording_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID REFERENCES extension_recordings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE chrome_extension_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_recording_participants ENABLE ROW LEVEL SECURITY;

-- Policies for chrome_extension_users
DROP POLICY IF EXISTS "Users can view their own extension data" ON chrome_extension_users;
CREATE POLICY "Users can view their own extension data"
  ON chrome_extension_users FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own extension data" ON chrome_extension_users;
CREATE POLICY "Users can update their own extension data"
  ON chrome_extension_users FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own extension data" ON chrome_extension_users;
CREATE POLICY "Users can insert their own extension data"
  ON chrome_extension_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for extension_recordings
DROP POLICY IF EXISTS "Users can view recordings they created" ON extension_recordings;
CREATE POLICY "Users can view recordings they created"
  ON extension_recordings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own recordings" ON extension_recordings;
CREATE POLICY "Users can insert their own recordings"
  ON extension_recordings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own recordings" ON extension_recordings;
CREATE POLICY "Users can update their own recordings"
  ON extension_recordings FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for extension_recording_participants
DROP POLICY IF EXISTS "Users can view participants for recordings they created" ON extension_recording_participants;
CREATE POLICY "Users can view participants for recordings they created"
  ON extension_recording_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM extension_recordings
      WHERE extension_recordings.id = extension_recording_participants.recording_id
      AND extension_recordings.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert participants for recordings they created" ON extension_recording_participants;
CREATE POLICY "Users can insert participants for recordings they created"
  ON extension_recording_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM extension_recordings
      WHERE extension_recordings.id = extension_recording_participants.recording_id
      AND extension_recordings.user_id = auth.uid()
    )
  );

-- Enable realtime for these tables
alter publication supabase_realtime add table chrome_extension_users;
alter publication supabase_realtime add table extension_recordings;
alter publication supabase_realtime add table extension_recording_participants;