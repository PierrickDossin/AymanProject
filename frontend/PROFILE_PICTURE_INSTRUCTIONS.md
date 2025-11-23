# Profile Picture Setup Instructions

## Step 1: Run SQL Migration in Supabase

1. Go to your Supabase Dashboard SQL Editor:
   - https://supabase.com/dashboard/project/wkwoggthnhemqcrnbdnc/sql/new

2. Copy and paste the entire contents of:
   `frontend/supabase/migrations/20251123000000_setup_profiles_and_storage.sql`

3. Click "Run" to execute the SQL

This will:
- Create the `profiles` table to store user profile data
- Create the `profile-pictures` storage bucket
- Set up Row Level Security (RLS) policies
- Set up storage policies for uploads
- Create a trigger to automatically create profiles when users sign up

## Step 2: Verify Storage Bucket

1. Go to Storage in Supabase Dashboard:
   - https://supabase.com/dashboard/project/wkwoggthnhemqcrnbdnc/storage/buckets

2. You should see a bucket called `profile-pictures` with:
   - Public access: ✅ Enabled
   - File size limit: Default (50MB is fine)

## Step 3: Test Profile Picture Upload

1. Go to your app (locally or production)
2. Click on your profile picture/avatar on the Dashboard
3. Select an image (max 5MB)
4. Click "Upload Picture"
5. The image should upload and display immediately

## How It Works

- **Upload Path**: Images are uploaded to `{userId}/{timestamp}.{extension}`
  - Example: `abc123-def456/1700000000.jpg`
- **Storage**: Supabase Storage bucket `profile-pictures`
- **Database**: Avatar URL is saved to both:
  - `auth.users.raw_user_meta_data.avatar_url`
  - `public.profiles.avatar_url`
- **Security**: RLS policies ensure users can only upload/update/delete their own pictures

## Troubleshooting

If uploads fail:
1. Check browser console for errors
2. Verify the storage bucket exists and is public
3. Verify storage policies are created (check Supabase Storage > Policies)
4. Ensure user is authenticated (check `user` object in console)
