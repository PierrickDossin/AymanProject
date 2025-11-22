import { AppDataSource } from "../../infrastructure/database/data-source";
import { Workout } from "../../infrastructure/database/entities/Workout";

export class AnalystAgent {
  /**
   * Analyzes the workout history for a specific user.
   * @param userId The ID of the user to analyze.
   * @returns A report containing consistency stats and suggestions.
   */
  async analyze(userId: string) {
    const workoutRepo = AppDataSource.getRepository(Workout);
    
    // Fetch last 30 days of workouts
    const workouts = await workoutRepo
      .createQueryBuilder("workout")
      .where("workout.userId = :userId", { userId })
      .orderBy("workout.date", "DESC")
      .getMany();

    if (workouts.length === 0) {
      return {
        message: "I don't see any workouts yet. Start logging to get insights!",
        stats: {
          totalWorkouts: 0,
          consistencyScore: 0,
        },
        suggestions: ["Try logging your first workout today!"]
      };
    }

    // 1. Calculate Consistency (Workouts per week)
    const totalWorkouts = workouts.length;
    const firstWorkoutDate = new Date(workouts[workouts.length - 1].date);
    const lastWorkoutDate = new Date(workouts[0].date);
    const daysDiff = Math.max(1, (lastWorkoutDate.getTime() - firstWorkoutDate.getTime()) / (1000 * 3600 * 24));
    const weeks = Math.max(1, daysDiff / 7);
    const workoutsPerWeek = (totalWorkouts / weeks).toFixed(1);

    // 2. Identify Neglected Muscle Groups (Simple keyword search in workout names for now)
    // In a real app, we'd join with the Exercise entity.
    const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Cardio"];
    const workoutNames = workouts.map(w => w.name.toLowerCase());
    
    const neglectedGroups = muscleGroups.filter(group => {
      return !workoutNames.some(name => name.includes(group.toLowerCase()));
    });

    // 3. Generate Report
    const suggestions = [];
    if (neglectedGroups.length > 0) {
      suggestions.push(`You haven't focused on these groups recently: ${neglectedGroups.join(", ")}.`);
    }
    if (parseFloat(workoutsPerWeek) < 2) {
      suggestions.push("Try to aim for at least 3 workouts per week for better progress.");
    } else {
      suggestions.push("Great consistency! Keep it up.");
    }

    return {
      message: "Analysis complete.",
      stats: {
        totalWorkouts,
        workoutsPerWeek,
        lastWorkout: lastWorkoutDate.toISOString().split('T')[0]
      },
      neglectedGroups,
      suggestions
    };
  }
}
