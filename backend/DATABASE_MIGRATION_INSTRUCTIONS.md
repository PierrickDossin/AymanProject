# Database Migration Instructions

## Adding startValue Column to Goals Table

This migration adds a `startValue` column to the `goals` table to track the initial value when a goal was created. This enables accurate progress tracking (0-100%) from start to current to target.

### Steps to Run on Railway:

1. **Open Railway Dashboard**
   - Go to: https://railway.app/
   - Navigate to your project: `aymanproject-production`
   - Select the PostgreSQL database service

2. **Open Query Console**
   - Click on the "Data" tab
   - Click "Query" button to open the SQL console

3. **Run the Migration SQL**
   - Copy the contents of `add-start-value.sql`
   - Paste into the Railway query console
   - Click "Execute" or press Cmd/Ctrl + Enter

4. **Verify the Migration**
   - The script will output a verification query showing:
     - `column_name`: startValue
     - `data_type`: double precision
     - `is_nullable`: NO

### What This Migration Does:

1. ✅ Adds `startValue` column as DOUBLE PRECISION
2. ✅ Sets `startValue = currentValue` for existing goals (backward compatibility)
3. ✅ Makes the column NOT NULL
4. ✅ Verifies the column was added correctly

### After Migration:

- Existing goals will have `startValue` equal to their current `currentValue`
- New goals created through the app will have `startValue` set properly
- Progress bars and graphs will work correctly for all goals
- The app already has fallback logic (`startValue || currentValue`) so it works before and after migration

### Alternative: Run via Railway CLI

If you have Railway CLI installed:

```bash
railway login
railway link
cat add-start-value.sql | railway run psql
```

---

**Note:** The backend code has already been deployed with the `startValue` field in the Goal entity. This SQL migration just updates the existing database schema to match.
