# Profile Picture Setup

## Run This SQL in Supabase

Go to: **SQL Editor** in your Supabase dashboard and run this:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile pictures
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can upload their own profile picture"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile picture"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile picture"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## What This Does

- Creates a **public storage bucket** for profile pictures
- Sets up **security policies** so users can only modify their own pictures
- Allows everyone to **view** profile pictures (for public profiles)

## How to Use

After running the SQL:

1. Login to your app
2. Click on your avatar in the top-right corner of the Dashboard
3. Select an image (max 5MB)
4. Click "Upload Picture"
5. Your profile picture will be updated!

You can also remove your profile picture at any time by clicking the avatar and selecting "Remove Picture".
