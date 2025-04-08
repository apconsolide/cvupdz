-- Create zoom_meetings table
CREATE TABLE IF NOT EXISTS zoom_meetings (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  agenda TEXT,
  join_url TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create zoom_participants table
CREATE TABLE IF NOT EXISTS zoom_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT NOT NULL REFERENCES zoom_meetings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  join_time TIMESTAMP WITH TIME ZONE NOT NULL,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create zoom_recordings table
CREATE TABLE IF NOT EXISTS zoom_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id TEXT NOT NULL REFERENCES zoom_meetings(id) ON DELETE CASCADE,
  recording_start TIMESTAMP WITH TIME ZONE NOT NULL,
  recording_end TIMESTAMP WITH TIME ZONE NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  play_url TEXT NOT NULL,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tables to realtime publication if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'zoom_meetings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_meetings;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'zoom_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_participants;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'zoom_recordings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE zoom_recordings;
  END IF;
END
$$;

-- Add foreign key from training_sessions to zoom_meetings
ALTER TABLE training_sessions
ADD COLUMN IF NOT EXISTS zoom_meeting_id TEXT REFERENCES zoom_meetings(id);
