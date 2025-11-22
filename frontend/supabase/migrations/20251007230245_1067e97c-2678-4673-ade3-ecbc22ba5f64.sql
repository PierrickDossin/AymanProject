-- Add items column to meals table to store individual food items
ALTER TABLE public.meals 
ADD COLUMN items JSONB DEFAULT '[]'::jsonb;