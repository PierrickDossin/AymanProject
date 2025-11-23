# Railway Deployment Fix: ENETUNREACH Error

## Problem
Your Railway backend crashes with `ENETUNREACH` error because it's trying to connect to Supabase using **IPv6**, but Railway's standard environment only supports **IPv4**.

## Root Cause
The direct Supabase connection URL (`db.wkwoggthnhemqcrnbdnc.supabase.co:5432`) resolves to an IPv6 address only. Railway cannot route to it.

## Solution
Use the **Supabase Connection Pooler** which provides IPv4 compatibility.

---

## Step-by-Step Fix

### 1. Update Railway `DATABASE_URL` Variable

Go to your Railway project > **Variables** tab > Edit `DATABASE_URL`:

**Replace your current value with this exact string:**

```
postgresql://postgres.wkwoggthnhemqcrnbdnc:ycR9QX5Xk6GA7Mio@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Key differences from the old URL:**
- **Host:** `aws-0-eu-central-1.pooler.supabase.com` (not `db.wkwoggthnhemqcrnbdnc.supabase.co`)
- **Port:** `6543` (not `5432`)
- **User:** `postgres.wkwoggthnhemqcrnbdnc` (includes project ref)

### 2. Verify All Required Railway Variables

Ensure these variables are set:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | (Connection string above) | **Critical for IPv4** |
| `DB_SYNC` | `true` | Creates tables on first run |
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `4000` | Railway auto-assigns, but good to set |
| `FRONTEND_URL` | `https://lift-grow-thrive.vercel.app` | Your Vercel domain (no trailing slash) |
| `SESSION_SECRET` | (any random string) | For session encryption |
| `GOOGLE_CLIENT_ID` | `1013656030306-c17rkoe9otsvif9d43n7iklkq23g0v0v.apps.googleusercontent.com` | For OAuth |
| `GOOGLE_CLIENT_SECRET` | `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` | For OAuth |
| `GOOGLE_CALLBACK_URL` | `https://aymanproject-production.up.railway.app/auth/google/callback` | Update with your Railway URL |

### 3. Redeploy

After saving the `DATABASE_URL` variable, Railway will automatically redeploy. Wait 2-3 minutes.

### 4. Verify Success

Check the **Deployment Logs** in Railway. You should see:

```
✅ Database initialized successfully
🚀 Server running on http://localhost:4000
```

**If you still see `ENETUNREACH`:**
- Double-check the `DATABASE_URL` is **exactly** as shown above
- Ensure there are no extra spaces or quotes around the value
- Verify you clicked **Save** in Railway

---

## Why This Works

The Supabase **Connection Pooler** (`aws-0-eu-central-1.pooler.supabase.com`) is specifically designed for IPv4-only environments like:
- Railway
- Heroku
- AWS Lambda
- Most serverless platforms

The direct database URL (`db.*.supabase.co`) uses modern IPv6, which many cloud platforms don't support yet.

---

## After the Fix

Once the backend is running:

1. **Test the Health Endpoint:**
   ```bash
   curl https://aymanproject-production.up.railway.app/health
   ```
   You should get: `{"ok":true}`

2. **Update Vercel:**
   - Go to Vercel > Settings > Environment Variables
   - Set `VITE_API_URL` to `https://aymanproject-production.up.railway.app/api`
   - Redeploy Vercel

3. **Test Login:**
   - Open your Vercel frontend
   - Try logging in
   - CORS errors should be gone

---

## Quick Reference: Connection String Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

For Supabase Pooler:
USER     = postgres.[PROJECT_REF]
PASSWORD = your-database-password
HOST     = aws-0-[REGION].pooler.supabase.com
PORT     = 6543 (Transaction mode) or 5432 (Session mode, but use 6543)
DATABASE = postgres
```

Your specific values:
- PROJECT_REF: `wkwoggthnhemqcrnbdnc`
- PASSWORD: `ycR9QX5Xk6GA7Mio`
- REGION: `eu-central-1`

---

## Still Having Issues?

If the error persists after following all steps:

1. **Check Railway Build Logs:** Ensure the code deployed correctly
2. **Verify Supabase is Running:** Check your Supabase dashboard
3. **Test Connection Locally:**
   ```bash
   psql "postgresql://postgres.wkwoggthnhemqcrnbdnc:ycR9QX5Xk6GA7Mio@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   ```
4. **Check for Typos:** The username must include the project ref prefix

If you see `connection timeout` instead of `ENETUNREACH`, it means the URL is correct but Supabase might have firewall rules blocking Railway. (This is rare—Supabase allows all IPs by default.)
