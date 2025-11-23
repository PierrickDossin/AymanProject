-- STEP 1: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own water logs" ON public.water_logs;
DROP POLICY IF EXISTS "Users can insert their own water logs" ON public.water_logs;
DROP POLICY IF EXISTS "Users can update their own water logs" ON public.water_logs;
DROP POLICY IF EXISTS "Users can delete their own water logs" ON public.water_logs;

-- STEP 2: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  water_goal INTEGER DEFAULT 1500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- STEP 5: Create water_logs table
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 6: Enable RLS on water_logs
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create water_logs policies
CREATE POLICY "Users can view their own water logs"
  ON public.water_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs"
  ON public.water_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water logs"
  ON public.water_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs"
  ON public.water_logs FOR DELETE
  USING (auth.uid() = user_id);

-- STEP 8: Create index
CREATE INDEX IF NOT EXISTS water_logs_user_id_logged_at_idx 
  ON public.water_logs(user_id, logged_at DESC);

-- STEP 9: Verify tables were created
SELECT 'profiles table exists' as status WHERE EXISTS (
  SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles'
);

SELECT 'water_logs table exists' as status WHERE EXISTS (
  SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'water_logs'
);
