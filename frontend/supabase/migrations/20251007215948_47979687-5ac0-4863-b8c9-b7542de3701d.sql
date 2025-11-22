-- Add goal_type column to goals table
ALTER TABLE public.goals
ADD COLUMN goal_type text NOT NULL DEFAULT 'weight',
ADD COLUMN target_value numeric NOT NULL DEFAULT 0,
ADD COLUMN unit text NOT NULL DEFAULT 'kg';

-- Rename columns for clarity
ALTER TABLE public.goals
RENAME COLUMN goal_weight TO initial_value;

ALTER TABLE public.goals
RENAME COLUMN current_weight TO current_value;

-- Create progress tracking table
CREATE TABLE public.goal_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL
);

-- Enable RLS on goal_progress
ALTER TABLE public.goal_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for goal_progress
CREATE POLICY "Users can view their own progress"
ON public.goal_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
ON public.goal_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.goal_progress
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.goal_progress
FOR DELETE
USING (auth.uid() = user_id);