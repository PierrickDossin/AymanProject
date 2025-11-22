# Deployment Troubleshooting Checklist (CORS & 502 Errors)

This document outlines the critical settings you need to verify in **Vercel** (Frontend) and **Railway** (Backend) to resolve the 502 Bad Gateway and CORS errors you are seeing.

## 1. Railway (Backend) Configuration

Go to your [Railway Dashboard](https://railway.app/), select your project, and click on the **Variables** tab.

### Required Environment Variables
Ensure the following variables are set exactly as shown (replace values with your actual secrets):

| Variable Name | Value / Format | Description |
| :--- | :--- | :--- |
| `PORT` | `4000` | The port the server listens on. |
| `NODE_ENV` | `production` | Tells the app it's in production mode. |
| `FRONTEND_URL` | `https://lift-grow-thrive.vercel.app` | **Crucial for CORS.** Must match your Vercel URL exactly (no trailing slash). |
| `DATABASE_URL` | `postgresql://...` | Connection string for your PostgreSQL database. **Required** for production. |
| `SESSION_SECRET` | `(Any long random string)` | Used to sign session cookies. |
| `GOOGLE_CALLBACK_URL` | `https://aymanproject-production.up.railway.app/auth/google/callback` | Must match your Railway URL + path. |

### Build & Start Settings (Settings Tab)
*   **Build Command:** `npm run build`
*   **Start Command:** `npm start`
*   **Watch Paths:** (Leave empty)

### ⚠️ Critical Checks for Railway
1.  **Check the Logs:** Go to **Deployments** > Click the latest one > **View Logs**.
    *   Do you see `🚀 Server running on http://localhost:4000`?
    *   If you see **Error** or **Crash**, the server is not running, which causes the 502.
2.  **Database:** If `DATABASE_URL` is missing, the app tries to use SQLite. On Railway, this can cause issues. Ensure you have a PostgreSQL service linked.

---

## 2. Vercel (Frontend) Configuration

Go to your [Vercel Dashboard](https://vercel.com/), select your project, and go to **Settings** > **Environment Variables**.

### Required Environment Variables

| Variable Name | Value / Format | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://aymanproject-production.up.railway.app/api` | **Crucial.** Must point to your Railway backend URL. |

### ⚠️ Critical Checks for Vercel
1.  **No Double Protocol:** Ensure the value is NOT `https://https://...`. It should be just `https://aymanproject-production.up.railway.app/api`.
2.  **Redeploy:** After changing variables, you **MUST** go to **Deployments** and redeploy.

---

## 3. How to Verify

1.  **Open Railway Logs:** Confirm the server started successfully.
2.  **Open Vercel App:** Try to login.
3.  **Check Network Tab:** If you still get 502, the issue is 100% on the Railway side (crashing or misconfigured port).
