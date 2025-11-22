// Test script to verify backend API endpoints
const API_URL = "http://localhost:4000/api";

async function testAPI() {
  console.log("🧪 Testing Backend API...\n");

  try {
    // Test 1: Create a user
    console.log("1️⃣ Creating test user...");
    const userResponse = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        name: "Test User",
      }),
    });
    const user = await userResponse.json();
    console.log("✅ User created:", user.id);

    // Test 2: Create a meal
    console.log("\n2️⃣ Creating test meal...");
    const mealResponse = await fetch(`${API_URL}/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: "Breakfast",
        date: new Date().toISOString().split("T")[0],
        calories: 350,
        protein: 20,
        carbs: 45,
        fat: 10,
        items: [
          { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
          { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
          { name: "Eggs", calories: 95, protein: 14, carbs: 1, fat: 7 },
        ],
      }),
    });
    const meal = await mealResponse.json();
    console.log("✅ Meal created:", meal.id);

    // Test 3: Get meals
    console.log("\n3️⃣ Fetching meals...");
    const mealsResponse = await fetch(
      `${API_URL}/meals?userId=${user.id}&date=${new Date().toISOString().split("T")[0]}`
    );
    const meals = await mealsResponse.json();
    console.log(`✅ Found ${meals.length} meal(s)`);
    console.log("   Meal:", meals[0].name, "-", meals[0].calories, "kcal");

    // Test 4: Create a goal
    console.log("\n4️⃣ Creating test goal...");
    const goalResponse = await fetch(`${API_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        type: "weight",
        targetValue: 75,
        currentValue: 80,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "active",
      }),
    });
    const goal = await goalResponse.json();
    console.log("✅ Goal created:", goal.id);

    // Test 5: Create a workout
    console.log("\n5️⃣ Creating test workout...");
    const workoutResponse = await fetch(`${API_URL}/workouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: "Morning Workout",
        date: new Date().toISOString().split("T")[0],
        duration: 45,
        caloriesBurned: 300,
        exercises: [
          { name: "Push-ups", sets: 3, reps: 15 },
          { name: "Squats", sets: 3, reps: 20 },
          { name: "Plank", sets: 3, reps: 60 },
        ],
      }),
    });
    const workout = await workoutResponse.json();
    console.log("✅ Workout created:", workout.id);

    // Test 6: Clean up - delete test data
    console.log("\n6️⃣ Cleaning up test data...");
    await fetch(`${API_URL}/meals/${meal.id}`, { method: "DELETE" });
    await fetch(`${API_URL}/goals/${goal.id}`, { method: "DELETE" });
    await fetch(`${API_URL}/workouts/${workout.id}`, { method: "DELETE" });
    await fetch(`${API_URL}/users/${user.id}`, { method: "DELETE" });
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All API tests passed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response:", await error.response.text());
    }
  }
}

testAPI();
