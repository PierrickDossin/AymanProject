# Google OAuth Setup Guide

## 🔧 Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Lift Grow Thrive" (or your app name)
4. Click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Click "Configure Consent Screen" (if prompted)
   - Choose "External" if you want anyone to test
   - Fill in:
     - App name: "Lift Grow Thrive"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if using External
   - Click "Save and Continue"

4. Back to Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "Lift Grow Thrive Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:4000`
     - `http://localhost:8080`
   - Authorized redirect URIs:
     - `http://localhost:4000/auth/google/callback`
   - Click "Create"

5. **Copy** your Client ID and Client Secret

### Step 4: Update Environment Variables

Create a `.env` file in the `backend` folder (copy from `.env.example`):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Session
SESSION_SECRET=generate_a_random_string_here

# Frontend
FRONTEND_URL=http://localhost:8080
```

### Step 5: Restart Backend Server

```bash
cd backend
npm run dev
```

## 🎯 How It Works

### Flow:
1. User clicks "Continue with Google" button
2. Frontend redirects to: `http://localhost:4000/auth/google`
3. Backend redirects to Google's OAuth page
4. User logs in with Google
5. Google redirects back to: `http://localhost:4000/auth/google/callback`
6. Backend:
   - Verifies the OAuth token
   - Gets user's email and name from Google
   - Creates account if new user, or logs in existing user
7. Backend redirects to: `http://localhost:8080/auth/callback?user={userData}`
8. Frontend stores user and redirects to dashboard

### Testing:
1. Go to http://localhost:8080/login
2. Click "Continue with Google"
3. Should see Google's login page
4. After login, redirected back to your app

## 🔒 Security Notes

- Session secret should be a long random string in production
- In production, update authorized origins/redirects to your domain
- Enable HTTPS in production
- Consider using JWT tokens instead of sessions for better scalability

## 📝 Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure `http://localhost:4000/auth/google/callback` is in authorized redirect URIs
- Check that GOOGLE_CALLBACK_URL in .env matches exactly

**Error: "Access blocked: This app's request is invalid"**
- Make sure you've enabled Google+ API
- Check OAuth consent screen is configured

**Error: "Not authenticated" after clicking Google button**
- Check backend logs for passport errors
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
