# Water Tracking Setup Instructions

## Step 1: Run SQL Migration in Supabase

1. Go to your Supabase Dashboard SQL Editor:
   - https://supabase.com/dashboard/project/wkwoggthnhemqcrnbdnc/sql/new

2. Copy and paste the entire contents of:
   `frontend/supabase/migrations/20251123010000_create_water_tracking.sql`

3. Click "Run" to execute the SQL

This will:
- Add `water_goal` column to `profiles` table (default 1500ml = 1.5L)
- Create `water_logs` table to track daily water intake
- Set up Row Level Security (RLS) policies
- Create indexes for faster queries

## Features

### Dashboard Water Section
- Displays circular progress showing water consumed vs goal
- Quick add buttons: +250ml (Glass), +500ml (Bottle), +1L (Large)
- Real-time updates after logging water
- Visual progress indicator

### Water Goal Settings Page
- Set custom daily water goal (in liters)
- Quick presets: 1L, 1.5L, 2L, 2.5L, 3L
- Custom input with decimal support (0.1-10L)
- Hydration tips and recommendations
- Access via Settings icon in Dashboard water section

## How It Works

**Data Structure:**
- Water amounts stored in milliliters (ml)
- Default goal: 1500ml (1.5L)
- Tracks per-user, per-day totals

**API Functions (waterApi):**
- `getTodayTotal(userId)` - Get total water consumed today
- `getTodayStats(userId)` - Get full stats (total, goal, remaining, percentage)
- `logWater(userId, amount)` - Log water intake
- `getWaterLogs(userId, date)` - Get all logs for a specific date
- `deleteWaterLog(id)` - Delete a water log entry
- `updateWaterGoal(userId, goal)` - Update daily goal
- `getWaterGoal(userId)` - Get current daily goal

**Routes:**
- `/` - Dashboard with water tracker
- `/nutrition/water-goal` - Water goal settings page

## Troubleshooting

If water tracking doesn't work:
1. Verify SQL migration ran successfully
2. Check `water_logs` and `profiles` tables exist in Supabase
3. Verify RLS policies are active
4. Check browser console for errors
5. Ensure user is authenticated

## Usage Example

```typescript
import { waterApi } from "@/lib/waterApi";

// Log 500ml of water
await waterApi.logWater(userId, 500);

// Get today's stats
const stats = await waterApi.getTodayStats(userId);
console.log(`Consumed: ${stats.totalToday}ml / ${stats.goal}ml`);
console.log(`Progress: ${stats.percentage}%`);

// Update goal to 2L
await waterApi.updateWaterGoal(userId, 2000);
```
