import { Workout, PlannedExercise } from "../infrastructure/database/entities/Workout";
import { WorkoutRepository } from "../repositories/WorkoutRepository";

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();

  async getAllWorkouts(userId: string): Promise<Workout[]> {
    return this.workoutRepository.findByUserId(userId);
  }

  async getWorkoutById(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findById(id);
    if (!workout) {
      throw new Error("Workout not found");
    }
    return workout;
  }

  async getTodayWorkout(userId: string, date: string): Promise<Workout | null> {
    return this.workoutRepository.findByUserAndDate(userId, date);
  }

  async getWorkoutsByDateRange(userId: string, startDate: string, endDate: string): Promise<Workout[]> {
    return this.workoutRepository.findByDateRange(userId, startDate, endDate);
  }

  async getUpcomingWorkouts(userId: string, fromDate: string, limit: number = 5): Promise<Workout[]> {
    return this.workoutRepository.findUpcoming(userId, fromDate, limit);
  }

  async getWeeklyStats(userId: string, weekStart: string, weekEnd: string): Promise<{
    totalWorkouts: number;
    completedWorkouts: number;
    plannedWorkouts: number;
  }> {
    const workouts = await this.workoutRepository.getWeeklyWorkouts(userId, weekStart, weekEnd);
    return {
      totalWorkouts: workouts.length,
      completedWorkouts: workouts.filter(w => w.status === "completed").length,
      plannedWorkouts: workouts.filter(w => w.status === "planned").length
    };
  }

  async createWorkout(workoutData: {
    userId: string;
    name: string;
    scheduledDate: string;
    exercises: PlannedExercise[];
  }): Promise<Workout> {
    // Calculate total duration
    const totalDuration = workoutData.exercises.reduce((sum, ex) => sum + ex.duration, 0);

    return this.workoutRepository.create({
      ...workoutData,
      totalDuration,
      status: "planned"
    });
  }

  async updateWorkout(id: string, workoutData: Partial<Workout>): Promise<Workout> {
    // Recalculate total duration if exercises were updated
    if (workoutData.exercises) {
      workoutData.totalDuration = workoutData.exercises.reduce((sum, ex) => sum + ex.duration, 0);
    }

    const workout = await this.workoutRepository.update(id, workoutData);
    if (!workout) {
      throw new Error("Workout not found");
    }
    return workout;
  }

  async completeWorkout(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.markCompleted(id);
    if (!workout) {
      throw new Error("Workout not found");
    }
    return workout;
  }

  async deleteWorkout(id: string): Promise<void> {
    const deleted = await this.workoutRepository.delete(id);
    if (!deleted) {
      throw new Error("Workout not found");
    }
  }

  async duplicateWorkout(id: string, newDate: string): Promise<Workout> {
    const originalWorkout = await this.getWorkoutById(id);
    
    return this.createWorkout({
      userId: originalWorkout.userId,
      name: originalWorkout.name,
      scheduledDate: newDate,
      exercises: originalWorkout.exercises
    });
  }
}
