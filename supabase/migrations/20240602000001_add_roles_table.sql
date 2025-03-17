-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access to all features'),
('supervisor', 'Supervisor with access to manage training sessions and users'),
('participant', 'Regular user with access to basic features')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_id INTEGER;
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_role
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Create trigger to automatically add users to profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_id INTEGER;
BEGIN
  -- Get role_id based on user metadata role
  SELECT id INTO role_id FROM roles WHERE name = (NEW.raw_user_meta_data->>'role')::text
  OR name = 'participant' LIMIT 1;
  
  -- Insert into profiles if not exists
  INSERT INTO public.profiles (id, full_name, role, role_id, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant'),
    role_id,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    role_id = EXCLUDED.role_id,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for roles table
ALTER PUBLICATION supabase_realtime ADD TABLE roles;
