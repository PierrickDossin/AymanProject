# Supabase Database Setup Guide

## Overview
This guide will help you migrate from SQLite (local development) to Supabase PostgreSQL (production).

## Why Supabase?
- ✅ **Free PostgreSQL database** hosted in the cloud
- ✅ **Automatic backups** and database management
- ✅ **Scalable** - handles production traffic easily
- ✅ **Built-in authentication** (optional to use)
- ✅ **Real-time subscriptions** (optional feature)

---

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (or login if you have one)
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: `ayman-fitness-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient to start
5. Click **"Create new project"** and wait 2-3 minutes for setup

---

## Step 2: Get Your Database Connection String

1. Once your project is created, go to **Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll down to **Connection String** section
4. Select the **URI** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]` with the password you created in Step 1**

---

## Step 3: Update Your Backend Environment Variables

1. Open `backend/.env` file
2. Add your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
3. For production deployment (Vercel/Render/etc), add this as an environment variable

---

## Step 4: Create Database Tables

The application uses TypeORM entities which will automatically create tables. However, for production with `synchronize: false`, we need to create tables manually.

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste the schema below
4. Click **"Run"**

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "profilePictureUrl" TEXT,
    "googleId" VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Goals table
CREATE TABLE IF NOT EXISTS "goal" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    "targetValue" DECIMAL(10, 2),
    "currentValue" DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    deadline DATE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Meals table
CREATE TABLE IF NOT EXISTS "meal" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(10, 2),
    carbs DECIMAL(10, 2),
    fats DECIMAL(10, 2),
    "mealTime" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Workouts table
CREATE TABLE IF NOT EXISTS "workout" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    duration INTEGER,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Exercises table
CREATE TABLE IF NOT EXISTS "exercise" (
    id SERIAL PRIMARY KEY,
    "workoutId" INTEGER NOT NULL REFERENCES "workout"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(10, 2),
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "user"("googleId");
CREATE INDEX IF NOT EXISTS idx_goal_user_id ON "goal"("userId");
CREATE INDEX IF NOT EXISTS idx_meal_user_id ON "meal"("userId");
CREATE INDEX IF NOT EXISTS idx_workout_user_id ON "workout"("userId");
CREATE INDEX IF NOT EXISTS idx_exercise_workout_id ON "exercise"("workoutId");
```

### Option B: Enable Synchronize Temporarily (Development Only)

⚠️ **WARNING**: Only use this in a fresh database, never on production data!

1. In `backend/src/infrastructure/database/data-source.ts`
2. Temporarily change `synchronize: false` to `synchronize: true`
3. Run your backend once: `npm run dev`
4. Tables will be auto-created
5. **IMPORTANT**: Set `synchronize` back to `false` immediately!

---

## Step 5: Test the Connection

1. Start your backend with Supabase:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see in the console:
   ```
   ✅ Database initialized successfully
   🚀 Server running on http://localhost:4000
   ```

3. If you see any errors, check:
   - DATABASE_URL is correct
   - Password has no typos
   - Tables are created in Supabase
   - No firewall blocking port 5432

---

## Step 6: Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. You should see all your tables: `user`, `goal`, `meal`, `workout`, `exercise`
3. You can view/edit data directly here

---

## Local Development vs Production

### Local Development (SQLite)
- **Don't set** `DATABASE_URL` in `.env`
- App will use `database.sqlite` file
- Fast, simple, no internet needed

### Production (Supabase)
- **Set** `DATABASE_URL` in environment variables
- App automatically switches to PostgreSQL
- Data persists in cloud

---

## Environment Variable Summary

```env
# Development: Leave this commented out
# DATABASE_URL=...

# Production: Add your Supabase URL
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

---

## Common Issues & Solutions

### ❌ "Connection refused" or "timeout"
- Check your internet connection
- Verify DATABASE_URL is correct
- Check Supabase project is running (green status)

### ❌ "password authentication failed"
- Double-check password in DATABASE_URL
- Password might contain special characters - URL encode them

### ❌ "relation does not exist"
- Tables not created yet
- Run the SQL schema from Step 4

### ❌ "SSL connection required"
- Make sure `ssl: { rejectUnauthorized: false }` is in data-source.ts
- This is already configured!

---

## Security Best Practices

1. ✅ **Never commit** `.env` file to GitHub (already in `.gitignore`)
2. ✅ **Use strong passwords** for database
3. ✅ **Enable Row Level Security (RLS)** in Supabase for extra protection
4. ✅ **Rotate passwords** periodically
5. ✅ **Use environment variables** in deployment platforms

---

## Next Steps

Once Supabase is set up:

1. ✅ Test all API endpoints work
2. ✅ Deploy backend to Vercel/Render with DATABASE_URL
3. ✅ Update frontend to use production API URL
4. ✅ (Optional) Set up Supabase Auth if you want to replace Passport

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **TypeORM Docs**: https://typeorm.io
- **Check Supabase logs**: Dashboard → Logs

---

**You're all set! Your app now supports both local SQLite and cloud PostgreSQL!** 🎉
