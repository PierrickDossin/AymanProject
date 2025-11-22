# Ayman Fitness App — Full Stack (Google OAuth + Supabase)

A full-stack fitness tracking application with **Google OAuth authentication**, **Supabase PostgreSQL database**, and a **React + TypeScript** frontend.

## 🏗️ Architecture

```
backend/
  src/
    domain/            # Entities + repository interfaces (business abstractions)
    application/       # Services / use-cases (pure business logic)
    infrastructure/    # Database, auth, config (TypeORM + Passport)
    presentation/      # HTTP controllers + routes (Express)
frontend/
  src/
    pages/             # React pages (Login, Goals, Meals, Workouts, etc.)
    components/        # Reusable UI components (shadcn/ui)
```

## 🚀 Features

- ✅ **Google OAuth 2.0** authentication
- ✅ **Dual database support**: SQLite (local) + PostgreSQL/Supabase (production)
- ✅ **Workout tracking** with exercises, sets, reps
- ✅ **Meal logging** with macros (calories, protein, carbs, fats)
- ✅ **Goal setting** and progress tracking
- ✅ **Android/iOS mobile apps** (Capacitor)

## 📦 Run Locally

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your Google OAuth credentials
npm install
npm run dev
# API => http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App => http://localhost:5173
```

## 🗄️ Database Setup

### Local Development (SQLite)
- No configuration needed!
- Just run `npm run dev` in backend
- Data stored in `backend/database.sqlite`

### Production (Supabase)
- Follow the comprehensive guide: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
- Set `DATABASE_URL` environment variable
- Automatic PostgreSQL connection

## 🔐 OAuth Setup

See **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** for detailed instructions on:
- Creating Google OAuth Client ID
- Configuring redirect URIs
- Setting up environment variables

## 📱 Build Mobile Apps

See **[BUILD_MOBILE_APPS.md](./BUILD_MOBILE_APPS.md)** for instructions on building Android/iOS apps with Capacitor.

## 🌐 Deploy to Production

See **[DEPLOY_WEBSITE.md](./DEPLOY_WEBSITE.md)** for deployment guides:
- Frontend: Vercel
- Backend: Render/Railway/Heroku
- Database: Supabase

## 📚 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Workouts
- `GET /api/workouts` - List all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout details
- `DELETE /api/workouts/:id` - Delete workout

### Meals
- `GET /api/meals` - List all meals
- `POST /api/meals` - Log a meal
- `DELETE /api/meals/:id` - Delete meal

### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id` - Update goal progress
- `DELETE /api/goals/:id` - Delete goal

## 🛠️ Tech Stack

**Frontend**:
- React + TypeScript + Vite
- shadcn/ui components
- Capacitor (mobile)

**Backend**:
- Node.js + Express + TypeScript
- TypeORM (database ORM)
- Passport.js (OAuth)
- better-sqlite3 / pg (databases)

**Database**:
- SQLite (development)
- PostgreSQL via Supabase (production)

## 📝 Notes

- Database automatically switches based on `DATABASE_URL` environment variable
- All sensitive data (`.env`, `database.sqlite`) is gitignored
- Use `npm run generate-schema` to help with database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**GitHub**: [https://github.com/PierrickDossin/AymanProject](https://github.com/PierrickDossin/AymanProject)

