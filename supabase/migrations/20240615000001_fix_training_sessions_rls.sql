-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all access to training_sessions" ON training_sessions;

-- Create a new policy that allows all operations
CREATE POLICY "Allow all access to training_sessions"
ON training_sessions
FOR ALL
USING (true);

-- Make sure RLS is enabled
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
