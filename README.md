# Lift Grow Thrive — Remake (Frontend + Backend, Layered Architecture)

This is a reorganized version of your project with a **clear split** between `frontend/` (Vite + React + shadcn/ui) and `backend/` (TypeScript + Express) using a **layered architecture**:

```
backend/
  src/
    domain/            # Entities + repository interfaces (business abstractions)
    application/       # Services / use-cases (pure business logic)
    infrastructure/    # Framework/DB/config/web/server glue
    presentation/      # HTTP controllers + routes (IO layer)
frontend/
  ...                  # Your original Vite React app
```

## Run locally

### Backend
```bash
cd backend
cp .env.example .env
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

The frontend can call the backend via e.g. `http://localhost:4000/api/workouts`.

## Notes
- The backend ships with an in-memory repository to keep things simple. Swap it for a real DB later (e.g., PostgreSQL + Prisma) by adding an implementation under `infrastructure/persistence/` that fulfills the `WorkoutRepository` interface.
- Routing example:
  - `GET /health` -> health check
  - `GET /api/workouts` -> list workouts
  - `POST /api/workouts` -> create a workout `{ "title": "Push day" }`
