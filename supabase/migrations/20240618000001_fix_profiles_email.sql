-- Add email column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Update the RLS policy for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

-- Create new policy
CREATE POLICY "Public profiles are viewable by everyone."
ON profiles FOR SELECT
USING (true);

-- Make sure profiles table is in the realtime publication
-- This is wrapped in a DO block to prevent errors if it's already in the publication
DO $$ 
BEGIN
  -- This will fail silently if the table is already in the publication
  PERFORM pg_catalog.pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles';
  IF NOT FOUND THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Do nothing if there's an error
  RAISE NOTICE 'profiles table is already in supabase_realtime publication';
END $$;
