-- Drop foreign key constraints for Supabase auth compatibility
-- Run this on your Railway PostgreSQL database

-- Drop foreign key constraint from goals table
ALTER TABLE goals DROP CONSTRAINT IF EXISTS "FK_57dd8a3fc26eb760d076bf8840e";

-- Drop foreign key constraint from meals table
ALTER TABLE meals DROP CONSTRAINT IF EXISTS meals_user_fkey;
ALTER TABLE meals DROP CONSTRAINT IF EXISTS "FK_meals_user";

-- Drop foreign key constraint from workouts table
ALTER TABLE workouts DROP CONSTRAINT IF EXISTS workouts_user_fkey;
ALTER TABLE workouts DROP CONSTRAINT IF EXISTS "FK_workouts_user";

-- Verify the constraints are removed
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('goals', 'meals', 'workouts');
