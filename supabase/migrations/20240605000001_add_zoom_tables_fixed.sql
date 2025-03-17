-- Create tables for Zoom integration

-- Table for Zoom meetings
CREATE TABLE IF NOT EXISTS zoom_meetings (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  agenda TEXT,
  join_url TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Zoom participants
CREATE TABLE IF NOT EXISTS zoom_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT NOT NULL REFERENCES zoom_meetings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  join_time TIMESTAMP WITH TIME ZONE NOT NULL,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Zoom recordings
CREATE TABLE IF NOT EXISTS zoom_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT NOT NULL REFERENCES zoom_meetings(id) ON DELETE CASCADE,
  recording_start TIMESTAMP WITH TIME ZONE NOT NULL,
  recording_end TIMESTAMP WITH TIME ZONE NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  play_url TEXT NOT NULL,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add meetLink column to training_sessions if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'training_sessions' 
                AND column_name = 'meet_link') THEN
    ALTER TABLE training_sessions ADD COLUMN meet_link TEXT;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_zoom_participants_meeting_id ON zoom_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_zoom_participants_email ON zoom_participants(email);
CREATE INDEX IF NOT EXISTS idx_zoom_recordings_meeting_id ON zoom_recordings(meeting_id);

-- Enable RLS
ALTER TABLE zoom_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoom_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoom_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admins can do everything with zoom_meetings" ON zoom_meetings;
CREATE POLICY "Admins can do everything with zoom_meetings"
  ON zoom_meetings
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Supervisors can view zoom_meetings" ON zoom_meetings;
CREATE POLICY "Supervisors can view zoom_meetings"
  ON zoom_meetings FOR SELECT
  USING (auth.jwt() ->> 'role' = 'supervisor');

DROP POLICY IF EXISTS "Admins can do everything with zoom_participants" ON zoom_participants;
CREATE POLICY "Admins can do everything with zoom_participants"
  ON zoom_participants
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Supervisors can view zoom_participants" ON zoom_participants;
CREATE POLICY "Supervisors can view zoom_participants"
  ON zoom_participants FOR SELECT
  USING (auth.jwt() ->> 'role' = 'supervisor');

DROP POLICY IF EXISTS "Admins can do everything with zoom_recordings" ON zoom_recordings;
CREATE POLICY "Admins can do everything with zoom_recordings"
  ON zoom_recordings
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Supervisors can view zoom_recordings" ON zoom_recordings;
CREATE POLICY "Supervisors can view zoom_recordings"
  ON zoom_recordings FOR SELECT
  USING (auth.jwt() ->> 'role' = 'supervisor');

DROP POLICY IF EXISTS "Participants can view zoom_recordings" ON zoom_recordings;
CREATE POLICY "Participants can view zoom_recordings"
  ON zoom_recordings FOR SELECT
  USING (true);

-- Enable realtime for these tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables 
                WHERE pubname = 'supabase_realtime' 
                AND tablename = 'zoom_meetings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_meetings;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables 
                WHERE pubname = 'supabase_realtime' 
                AND tablename = 'zoom_participants') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_participants;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables 
                WHERE pubname = 'supabase_realtime' 
                AND tablename = 'zoom_recordings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_recordings;
  END IF;
END $$;
