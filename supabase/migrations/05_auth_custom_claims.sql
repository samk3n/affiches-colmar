-- Function to sync public.profiles.role -> auth.users.raw_app_meta_data
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run sync on INSERT or UPDATE of profiles
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_role();

-- One-time sync for existing users
-- (This relies on the fact that an UPDATE on profiles triggers the function,
--  or we can run the update logic directly here for all matching rows)
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT * FROM public.profiles LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', profile_record.role)
    WHERE id = profile_record.id;
  END LOOP;
END;
$$;
