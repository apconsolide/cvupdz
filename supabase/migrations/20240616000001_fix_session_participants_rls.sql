-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all access to session_participants" ON session_participants;

-- Create a new policy that allows all operations
CREATE POLICY "Allow all access to session_participants"
ON session_participants
FOR ALL
USING (true);

-- Make sure RLS is enabled
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
