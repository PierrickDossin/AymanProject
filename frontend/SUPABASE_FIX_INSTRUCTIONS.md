# Fix Supabase Configuration

## Problem
You're getting an error when trying to create a weight goal because:
1. Row Level Security (RLS) policies are missing for the `goals` table
2. Anonymous authentication might not be enabled
3. Storage bucket for profile pictures is not set up

## Solution

### Step 1: Enable Anonymous Authentication

1. Go to: https://supabase.com/dashboard/project/kjucpurewtfednckguiy/auth/providers
2. Scroll down to "Anonymous sign-ins"
3. Enable "Allow anonymous sign-ins"
4. Click Save

### Step 2: Add RLS Policies to Goals Table

1. Go to: https://supabase.com/dashboard/project/kjucpurewtfednckguiy/sql
2. Copy and paste the SQL from `RUN_THIS_IN_SUPABASE.sql`
3. Click "Run"

OR manually add policies via UI:

1. Go to: https://supabase.com/dashboard/project/kjucpurewtfednckguiy/auth/policies
2. Find the `goals` table
3. Click "Enable RLS" if not already enabled
4. Add these 4 policies:

**Policy 1: SELECT**
- Name: `Users can view their own goals`
- Target roles: `authenticated`
- USING expression: `auth.uid() = user_id`

**Policy 2: INSERT**
- Name: `Users can create their own goals`
- Target roles: `authenticated`
- WITH CHECK expression: `auth.uid() = user_id`

**Policy 3: UPDATE**
- Name: `Users can update their own goals`
- Target roles: `authenticated`
- USING expression: `auth.uid() = user_id`

**Policy 4: DELETE**
- Name: `Users can delete their own goals`
- Target roles: `authenticated`
- USING expression: `auth.uid() = user_id`

### Step 3: Set Up Profile Pictures Storage

1. Go to: https://supabase.com/dashboard/project/kjucpurewtfednckguiy/sql
2. Copy and paste the SQL from `supabase/migrations/20251011120000_create_profile_pictures_bucket.sql`
3. Click "Run"

This will:
- Create a public storage bucket called `profile-pictures`
- Add policies so users can upload/update/delete their own pictures
- Allow anyone to view profile pictures

### Step 4: Test

1. Refresh your app
2. Try creating a weight goal again
3. Click on your avatar to upload a profile picture
4. Check the browser console for any error messages

## What These Changes Do

- **Anonymous Auth**: Allows users to use the app without signing up (creates temporary accounts automatically)
- **RLS Policies**: Ensures users can only see/modify their own data, providing security and privacy
- **Storage Bucket**: Secure storage for user profile pictures with proper access controls
