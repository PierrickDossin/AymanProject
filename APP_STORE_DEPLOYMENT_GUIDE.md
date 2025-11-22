# App Store Deployment Guide for OptiLift

## ✅ What's Been Done

1. ✅ Installed Capacitor (framework to convert web app to native iOS)
2. ✅ Initialized Capacitor project with:
   - App Name: **OptiLift**
   - Bundle ID: **com.optilift.app**
3. ✅ Built production version of the app
4. ✅ Installed iOS platform support

## 📋 Requirements Before Publishing

### 1. Apple Developer Account
- **Cost**: $99/year
- **Sign up at**: https://developer.apple.com/programs/enroll/
- You need this to publish any app on the App Store

### 2. Mac Computer
- **Required**: You MUST have a Mac to build iOS apps and submit to App Store
- Alternative: Use a Mac cloud service like MacStadium or MacinCloud

### 3. Xcode
- **Download**: From Mac App Store (free)
- **Required for**: Building and submitting iOS apps

## 🚀 Next Steps to Complete

### Step 1: Add iOS Platform
Run on your Windows machine:
```bash
cd "v:\ProjectAyman\folder 2\frontend"
npx cap add ios
```

This creates the iOS project files in `frontend/ios/` folder.

### Step 2: Transfer Project to Mac
Copy your entire project folder to your Mac computer.

### Step 3: Open in Xcode (On Mac)
```bash
cd frontend
npx cap open ios
```

This opens your project in Xcode.

### Step 4: Configure App in Xcode

1. **Update App Info**:
   - Click on your project name in left sidebar
   - Update Display Name, Bundle Identifier, Version, Build Number
   - Set minimum iOS version (recommend iOS 13.0+)

2. **Add App Icons**:
   - Prepare icons in these sizes: 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024
   - Place them in `ios/App/Assets.xcassets/AppIcon.appiconset/`
   - Tool to generate all sizes: https://appicon.co/

3. **Add Launch Screen**:
   - Create a splash screen image
   - Place in `ios/App/Assets.xcassets/Splash.imageset/`

4. **Set Signing & Capabilities**:
   - Select your Apple Developer Team
   - Xcode will automatically create provisioning profiles

### Step 5: Update Backend URL for Production

In `frontend/src/lib/api.ts`, update the API_BASE_URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://your-production-backend.com/api";
```

**Important**: You'll need to deploy your backend to a production server (options below).

### Step 6: Test on Real Device
1. Connect iPhone to Mac via USB
2. Select your device in Xcode
3. Click Run (▶️) button
4. App will install and run on your phone

### Step 7: Create App Store Listing

Go to https://appstoreconnect.apple.com/

1. **Create New App**:
   - Click "+" to add new app
   - Choose iOS platform
   - Enter app name: OptiLift
   - Select language (English)
   - Bundle ID: com.optilift.app
   - SKU: any unique identifier (e.g., "optilift001")

2. **Add Screenshots**:
   - Required: 6.7" iPhone screenshots (iPhone 15 Pro Max)
   - Required: 5.5" iPhone screenshots (iPhone 8 Plus)
   - Take screenshots from simulator or real device

3. **Write App Description**:
   ```
   OptiLift - Your Ultimate Fitness Companion

   Track your nutrition, workouts, and fitness goals all in one place!

   FEATURES:
   • 📊 Daily Nutrition Tracking - Log meals with detailed macros
   • 💪 Workout Management - Plan and track your training
   • 🎯 Goal Setting - Set and monitor fitness goals
   • 📈 Progress Tracking - See your journey over time
   • 🔥 Streak Counter - Stay motivated with daily streaks

   Perfect for anyone looking to:
   - Build muscle and gain strength
   - Lose weight sustainably
   - Track macros and calories
   - Stay consistent with fitness goals

   Download OptiLift today and start your transformation!
   ```

4. **Add Keywords**:
   fitness, workout, nutrition, calories, diet, gym, training, health, goals, macros

5. **Choose Category**:
   - Primary: Health & Fitness
   - Secondary: Lifestyle

6. **Set Age Rating**:
   - Select appropriate content ratings

7. **Add Privacy Policy**:
   - Required by Apple
   - Create one at: https://www.freeprivacypolicy.com/

### Step 8: Archive and Upload

In Xcode:
1. Select "Any iOS Device (arm64)" as target
2. Go to Product → Archive
3. Wait for archive to complete
4. Click "Distribute App"
5. Choose "App Store Connect"
6. Follow the wizard to upload

### Step 9: Submit for Review

In App Store Connect:
1. Select your app version
2. Click "Submit for Review"
3. Answer questionnaire about:
   - Export compliance
   - Advertising identifier usage
   - Content rights

**Review Time**: Usually 24-48 hours

## 🌐 Backend Deployment Options

Your backend needs to be publicly accessible. Options:

### Option 1: Railway (Easiest - Free Tier Available)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from backend folder
cd "v:\ProjectAyman\folder 2\backend"
railway init
railway up
```

### Option 2: Render (Free Tier)
1. Push your code to GitHub
2. Go to https://render.com/
3. Create new Web Service
4. Connect GitHub repo
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`

### Option 3: Heroku
1. Create account at https://heroku.com/
2. Install Heroku CLI
3. Deploy:
```bash
cd "v:\ProjectAyman\folder 2\backend"
heroku create optilift-backend
git push heroku main
```

### Option 4: AWS EC2 / DigitalOcean
- More control but requires server management
- Cost: ~$5-10/month

## 📱 Important Considerations

### 1. Backend Costs
- Free tiers exist but have limitations
- Plan for ~$10-25/month for production backend

### 2. Database
- SQLite won't work in production
- Migrate to PostgreSQL or MySQL
- Free options: Supabase, PlanetScale, Railway PostgreSQL

### 3. Push Notifications (Optional)
If you want push notifications:
```bash
npm install @capacitor/push-notifications
```

### 4. App Updates
Every time you update your app:
```bash
cd frontend
npm run build
npx cap sync
# Open in Xcode and archive again
```

## 🎯 Quick Checklist

- [ ] Apple Developer Account ($99/year)
- [ ] Mac computer access
- [ ] Xcode installed
- [ ] App icons created (all sizes)
- [ ] Launch screen/splash image
- [ ] Backend deployed to production
- [ ] Updated API URL in code
- [ ] App Store listing created
- [ ] Screenshots taken
- [ ] Privacy policy created
- [ ] App description written
- [ ] Tested on real device
- [ ] Archive created in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Submitted for review

## ⏱️ Timeline Estimate

- Setup & Configuration: 2-4 hours
- App Store listing: 1-2 hours
- Testing: 2-3 hours
- Archive & Upload: 30 minutes
- **Apple Review**: 1-2 days
- **Total**: About 1 week from start to App Store

## 💡 Tips for Approval

1. **Test Thoroughly**: Apple will test your app
2. **Follow Guidelines**: Read https://developer.apple.com/app-store/review/guidelines/
3. **No Crashes**: App must be stable
4. **Working Features**: All buttons/features must work
5. **Privacy**: Be transparent about data collection
6. **Age Appropriate**: Content must match age rating

## 🆘 Common Issues

**Issue**: "Signing for OptiLift requires a development team"
**Fix**: Select your team in Xcode → Signing & Capabilities

**Issue**: "Could not launch app on device"
**Fix**: Trust developer certificate on device (Settings → General → Device Management)

**Issue**: "The app references non-public selectors"
**Fix**: Usually a dependency issue, check Capacitor plugins

**Issue**: App rejected for "Minimum Functionality"
**Fix**: Add more features or better demonstrate existing ones

## 📞 Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Apple Developer Forums: https://developer.apple.com/forums/
- Stack Overflow: Tag with [capacitor] and [ios]

---

**Good luck with your App Store launch! 🚀**
