-- Trigger to automatically create a profile entry when a new user signs up/confirms email
-- This ensures the 'profiles' table is always in sync with 'auth.users'

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, date_of_birth)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Student'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, '2000-01-01')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
