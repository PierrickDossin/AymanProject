# New Project Setup Credentials

Use these exact values for your new Railway and Vercel projects.

## 1. Railway (Backend) Variables

| Variable Name | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.wkwoggthnhemqcrnbdnc:ycR9QX5Xk6GA7Mio@aws-0-eu-central-1.pooler.supabase.com:6543/postgres` |
| `DB_SYNC` | `true` (Set this to create tables on first run!) |
| `FRONTEND_URL` | `https://your-new-frontend-url.vercel.app` (Update this after deploying Vercel) |
| `PORT` | `4000` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | `any-random-string-you-want` |
| `GOOGLE_CALLBACK_URL` | `https://your-new-backend-url.up.railway.app/auth/google/callback` |

## 2. Vercel (Frontend) Variables

| Variable Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://your-new-backend-url.up.railway.app/api` (Update this after deploying Railway) |
| `VITE_SUPABASE_URL` | `https://wkwoggthnhemqcrnbdnc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd29nZ3RobmhlbXFjcm5iZG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDg1MjAsImV4cCI6MjA3OTQyNDUyMH0.U_do5ZGecf2NbvMgzJcnJIiBgmK6u6E2E7U0dbdhV-Y` |
| `VITE_SUPABASE_PROJECT_ID` | `wkwoggthnhemqcrnbdnc` |

## 3. Deployment Order

1.  **Deploy Backend to Railway** with the variables above.
    *   *Note:* It might fail initially if `FRONTEND_URL` is wrong, but that's okay.
    *   **Important:** Ensure `DB_SYNC` is `true` so it creates the database tables.
2.  **Deploy Frontend to Vercel**.
    *   Get the Vercel URL (e.g., `https://myapp.vercel.app`).
3.  **Update Railway Variables**:
    *   Set `FRONTEND_URL` to your Vercel URL.
    *   Redeploy Railway.
4.  **Update Vercel Variables**:
    *   Set `VITE_API_URL` to your Railway URL (e.g., `https://myapp.up.railway.app/api`).
    *   Redeploy Vercel.
