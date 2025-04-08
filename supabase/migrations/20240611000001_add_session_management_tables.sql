-- Add session_recordings table if it doesn't exist already
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  duration TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add session_participants table if it doesn't exist already
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  attendance_percentage NUMERIC,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Update training_sessions table if it doesn't have these columns
ALTER TABLE training_sessions
  ADD COLUMN IF NOT EXISTS meet_link TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS enrolled INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'webinar',
  ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL,
  ADD COLUMN IF NOT EXISTS end_time TIME NOT NULL;

-- Enable realtime for these tables
alter publication supabase_realtime add table session_recordings;
alter publication supabase_realtime add table session_participants;
alter publication supabase_realtime add table training_sessions;
