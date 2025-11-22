# 🚀 Quick Deployment Checklist

Use this checklist to deploy your Ayman Fitness App to production!

## ✅ Pre-Deployment Checklist

### 1. GitHub ✅ DONE
- [x] Code pushed to GitHub
- [x] Repository: https://github.com/PierrickDossin/AymanProject
- [x] `.gitignore` excludes sensitive files (.env, database.sqlite)

### 2. Database Setup (Supabase)
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
- [ ] Copy DATABASE_URL from Settings → Database
- [ ] Run the SQL schema from `SUPABASE_SETUP.md` (Step 4)
- [ ] Verify tables are created in Table Editor

### 3. Google OAuth Configuration
- [ ] Update Google Cloud Console OAuth settings
- [ ] Add production callback URL:
  ```
  https://your-backend.onrender.com/auth/google/callback
  ```
- [ ] Update authorized redirect URIs
- [ ] Save credentials for environment variables

### 4. Backend Deployment (Choose one)

#### Option A: Render.com (Recommended)
- [ ] Sign up at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Build Command: `cd backend && npm install && npm run build`
- [ ] Set Start Command: `cd backend && npm start`
- [ ] Add Environment Variables:
  ```
  DATABASE_URL=<your-supabase-url>
  GOOGLE_CLIENT_ID=<your-client-id>
  GOOGLE_CLIENT_SECRET=<your-client-secret>
  GOOGLE_CALLBACK_URL=https://your-app.onrender.com/auth/google/callback
  SESSION_SECRET=<random-string>
  FRONTEND_URL=https://your-frontend.vercel.app
  NODE_ENV=production
  ```
- [ ] Deploy and note the backend URL

#### Option B: Railway.app
- [ ] Sign up at https://railway.app
- [ ] Create new project from GitHub
- [ ] Select `backend` folder as root
- [ ] Add same environment variables as above
- [ ] Deploy

### 5. Frontend Deployment (Vercel)
- [ ] Sign up at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Add Environment Variables:
  ```
  VITE_API_URL=https://your-backend.onrender.com/api
  ```
- [ ] Deploy and note the frontend URL

### 6. Update OAuth Callback URLs
- [ ] Go back to Google Cloud Console
- [ ] Add your production frontend URL to Authorized origins:
  ```
  https://your-app.vercel.app
  ```
- [ ] Verify callback URL is correct

### 7. Final Testing
- [ ] Visit your frontend URL
- [ ] Click "Sign in with Google"
- [ ] Verify OAuth flow works
- [ ] Create a test workout/meal/goal
- [ ] Check data appears in Supabase Table Editor
- [ ] Test all major features

---

## 🔧 Environment Variables Quick Reference

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Google OAuth
GOOGLE_CLIENT_ID=your_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/auth/google/callback

# Session
SESSION_SECRET=super-secret-random-string-change-this

# Frontend
FRONTEND_URL=https://your-frontend.vercel.app

# Environment
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📱 Optional: Mobile App Deployment

### Android
- [ ] Follow `BUILD_MOBILE_APPS.md`
- [ ] Build APK: `npm run build:android`
- [ ] Test on device
- [ ] Upload to Google Play Store (see `APP_STORE_DEPLOYMENT_GUIDE.md`)

### iOS
- [ ] Follow `BUILD_MOBILE_APPS.md`
- [ ] Open in Xcode
- [ ] Build and archive
- [ ] Upload to App Store Connect

---

## 🐛 Common Issues

### "CORS Error"
✅ Make sure `FRONTEND_URL` is set correctly in backend environment variables

### "OAuth Error: redirect_uri_mismatch"
✅ Check Google Cloud Console → Authorized redirect URIs match exactly

### "Database connection failed"
✅ Verify `DATABASE_URL` is correct and tables are created

### "Session not persisting"
✅ Make sure `SESSION_SECRET` is set and cookies are enabled

---

## 📊 Monitoring

After deployment, monitor:
- **Backend logs**: Check Render/Railway dashboard
- **Database**: Supabase Dashboard → Database → Logs
- **Frontend**: Vercel Analytics
- **Errors**: Set up error tracking (Sentry, LogRocket, etc.)

---

## 🎉 You're Live!

Once all checkboxes are checked, your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **Database**: Managed by Supabase

Share the frontend URL with users and start collecting feedback!

---

## 📚 Additional Resources

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed database setup
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - OAuth configuration
- [DEPLOY_WEBSITE.md](./DEPLOY_WEBSITE.md) - Full deployment guide
- [BUILD_MOBILE_APPS.md](./BUILD_MOBILE_APPS.md) - Mobile app builds
