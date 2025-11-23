-- Add water_goal to profiles table (in milliliters, default 1500ml = 1.5L)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS water_goal INTEGER DEFAULT 1500;

-- Create water_logs table
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- in milliliters
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on water_logs
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

-- Water logs policies
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS water_logs_user_id_logged_at_idx 
  ON public.water_logs(user_id, logged_at DESC);
