-- Add meet_link column to training_sessions if it doesn't exist
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Create session_participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  attendance_percentage FLOAT,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Create session_recordings table if it doesn't exist
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  duration TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for the new tables
alter publication supabase_realtime add table session_participants;
alter publication supabase_realtime add table session_recordings;