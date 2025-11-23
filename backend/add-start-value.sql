-- Add startValue column to goals table
-- This column stores the initial value when the goal was created (for progress calculation)
-- Made nullable to handle existing data

ALTER TABLE goals 
ADD COLUMN IF NOT EXISTS "startValue" DOUBLE PRECISION;

-- Set startValue to currentValue for existing goals (backward compatibility)
UPDATE goals 
SET "startValue" = "currentValue" 
WHERE "startValue" IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'goals' AND column_name = 'startValue';
