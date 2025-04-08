-- Create zoom_meetings table if it doesn't exist
CREATE TABLE IF NOT EXISTS zoom_meetings (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  agenda TEXT,
  join_url TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE zoom_meetings ENABLE ROW LEVEL SECURITY;

-- Create policy for zoom_meetings
DROP POLICY IF EXISTS "Allow all access to zoom_meetings" ON zoom_meetings;
CREATE POLICY "Allow all access to zoom_meetings"
ON zoom_meetings
FOR ALL
USING (true);

-- Create zoom_participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS zoom_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT REFERENCES zoom_meetings(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE zoom_participants ENABLE ROW LEVEL SECURITY;

-- Create policy for zoom_participants
DROP POLICY IF EXISTS "Allow all access to zoom_participants" ON zoom_participants;
CREATE POLICY "Allow all access to zoom_participants"
ON zoom_participants
FOR ALL
USING (true);

-- Create zoom_recordings table if it doesn't exist
CREATE TABLE IF NOT EXISTS zoom_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT REFERENCES zoom_meetings(id),
  recording_start TIMESTAMP WITH TIME ZONE NOT NULL,
  recording_end TIMESTAMP WITH TIME ZONE NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  play_url TEXT NOT NULL,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE zoom_recordings ENABLE ROW LEVEL SECURITY;

-- Create policy for zoom_recordings
DROP POLICY IF EXISTS "Allow all access to zoom_recordings" ON zoom_recordings;
CREATE POLICY "Allow all access to zoom_recordings"
ON zoom_recordings
FOR ALL
USING (true);

-- Add zoom_meeting_id column to training_sessions if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'training_sessions' 
                AND column_name = 'zoom_meeting_id') THEN
    ALTER TABLE training_sessions ADD COLUMN zoom_meeting_id TEXT;
  END IF;
END $$;

-- Enable realtime for all tables
alter publication supabase_realtime add table zoom_meetings;
alter publication supabase_realtime add table zoom_participants;
alter publication supabase_realtime add table zoom_recordings;
