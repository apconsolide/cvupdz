-- Update the user with email excelzed@gmail.com to have admin role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
WHERE email = 'excelzed@gmail.com';

-- Also update the role in the profiles table
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'excelzed@gmail.com');
