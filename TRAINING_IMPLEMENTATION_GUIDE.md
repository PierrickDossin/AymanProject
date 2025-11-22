# Training System Implementation Guide

## ✅ Completed (Backend)

### 1. Exercise System
- ✅ Exercise entity with 100+ exercises
- ✅ Exercise repository, service, controller
- ✅ Exercise routes (`/api/exercises`)
- ✅ Seed data with exercises from Kaggle dataset
- ✅ Search, filter by muscle group/equipment

### 2. Workout System
- ✅ Workout entity (updated existing)
- ✅ Workout repository, service, controller
- ✅ Workout routes (`/api/workouts`)
- ✅ Support for scheduled workouts, completion tracking
- ✅ Weekly stats endpoint

### 3. Frontend API Client
- ✅ Exercise and Workout interfaces added
- ✅ All API methods implemented
- ✅ Exercise Library page created

## 🔄 Next Steps

### 1. Seed Exercises (Run Once)
```bash
# In backend, make a POST request to:
POST http://localhost:4000/api/exercises/seed
```

### 2. Update Training Page
File: `frontend/src/pages/Training.tsx`

**Changes Needed:**
- Fetch today's workout from API using `api.getTodayWorkout(userId, today)`
- Fetch upcoming workouts using `api.getUpcomingWorkouts(userId, today, 5)`
- Fetch weekly stats using `api.getWeeklyWorkoutStats(userId, weekStart, weekEnd)`
- Add timer functionality for workouts
- Add "Complete Workout" button that calls `api.completeWorkout(workoutId)`
- Show "Rest Day" when no workout scheduled
- Add link to Exercise Library page

### 3. Create Workout Calendar/Planner Page
File: `frontend/src/pages/WorkoutPlanner.tsx`

**Features Needed:**
- Calendar view (use `shadcn/ui Calendar` component)
- Click on day to view/add workout
- Form to create workout:
  - Workout name input
  - Exercise selector (searchable list from Exercise Library)
  - For each exercise: sets, reps, duration inputs
  - Save workout
- Ability to duplicate workout to multiple days
- Edit/delete existing workouts

### 4. Remove Personal Records
Files to update:
- `frontend/src/pages/Training.tsx` - Remove "Personal Records" stat
- `frontend/src/pages/Goals.tsx` - Remove "performance" goal type option
- `frontend/src/pages/SetGoal.tsx` - Remove performance option

### 5. Update Dashboard
File: `frontend/src/pages/Dashboard.tsx`

**Changes:**
- Update "Workouts This Week" to fetch from `api.getWeeklyWorkoutStats()`
- Show actual completed/planned ratio (e.g., "4/5")

### 6. Add Routes
File: `frontend/src/main.tsx` or router config

Add routes:
```tsx
<Route path="/training/library" element={<ExerciseLibrary />} />
<Route path="/training/planner" element={<WorkoutPlanner />} />
```

## 📊 API Endpoints Reference

### Exercises
- `GET /api/exercises` - Get all (with optional filters)
- `GET /api/exercises?muscleGroup=chest` - Filter by muscle
- `GET /api/exercises?equipment=barbell` - Filter by equipment
- `GET /api/exercises?search=press` - Search
- `POST /api/exercises/seed` - Seed exercises (run once)

### Workouts
- `GET /api/workouts?userId=xxx` - Get all workouts
- `GET /api/workouts/today?userId=xxx&date=2025-11-22` - Get today's workout
- `GET /api/workouts/upcoming?userId=xxx&fromDate=2025-11-22&limit=5` - Get upcoming
- `GET /api/workouts/stats/weekly?userId=xxx&weekStart=2025-11-18&weekEnd=2025-11-24` - Weekly stats
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `PATCH /api/workouts/:id/complete` - Mark complete
- `POST /api/workouts/:id/duplicate` - Duplicate to new date
- `DELETE /api/workouts/:id` - Delete workout

## 💡 Example Workout Creation

```typescript
const newWorkout = await api.createWorkout({
  userId: user.id,
  name: "Push Day",
  scheduledDate: "2025-11-23",
  exercises: [
    {
      exerciseId: "exercise-id-1",
      exerciseName: "Bench Press",
      sets: 4,
      reps: "8-10",
      duration: 15, // minutes
      notes: "Focus on form"
    },
    {
      exerciseId: "exercise-id-2",
      exerciseName: "Shoulder Press",
      sets: 3,
      reps: "10-12",
      duration: 10
    }
  ]
});
```

## 🎯 Timer Implementation

For the workout timer:
```typescript
const [timeRemaining, setTimeRemaining] = useState(todayWorkout?.totalDuration * 60); // convert to seconds
const [isTimerRunning, setIsTimerRunning] = useState(false);

useEffect(() => {
  if (!isTimerRunning || timeRemaining <= 0) return;
  
  const interval = setInterval(() => {
    setTimeRemaining((prev) => Math.max(0, prev - 1));
  }, 1000);
  
  return () => clearInterval(interval);
}, [isTimerRunning, timeRemaining]);

// Display: Math.floor(timeRemaining / 60) : (timeRemaining % 60)
```

## 🗓️ Week Calculation Helper

```typescript
function getWeekBounds(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
  
  const weekStart = new Date(date.setDate(diff));
  const weekEnd = new Date(date.setDate(diff + 6));
  
  return {
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0]
  };
}
```

## 🚀 Quick Start Commands

1. Start backend:
```bash
cd "v:\ProjectAyman\folder 2\backend"
npm run dev
```

2. Seed exercises (once):
```bash
curl -X POST http://localhost:4000/api/exercises/seed
```

3. Start frontend:
```bash
cd "v:\ProjectAyman\folder 2\frontend"
npm run dev
```

## ✨ Features Summary

**Completed:**
- ✅ 100+ exercise library with search/filter
- ✅ Backend workout scheduling system
- ✅ Weekly workout stats tracking
- ✅ Exercise Library UI

**To Implement:**
- ⏳ Workout Calendar/Planner UI
- ⏳ Today's Workout with timer
- ⏳ Workout completion tracking (checkbox)
- ⏳ Remove Personal Records
- ⏳ Connect Dashboard to real workout stats
- ⏳ "Rest Day" display when no workout

The backend is fully functional! Just need to build the remaining UI components.
