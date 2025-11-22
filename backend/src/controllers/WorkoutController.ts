import { Request, Response } from "express";
import { WorkoutService } from "../services/WorkoutPlanService.js";

export class WorkoutController {
  private workoutService = new WorkoutService();

  // Get all workouts for a user
  getByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const workouts = await this.workoutService.getAllWorkouts(userId as string);
      res.json(workouts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve workouts";
      res.status(500).json({ error: message });
    }
  };

  // Get workout by ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.getWorkoutById(id);
      res.json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Workout not found";
      res.status(404).json({ error: message });
    }
  };

  // Get today's workout
  getToday = async (req: Request, res: Response) => {
    try {
      const { userId, date } = req.query;
      if (!userId || !date) {
        return res.status(400).json({ error: "userId and date are required" });
      }
      const workout = await this.workoutService.getTodayWorkout(userId as string, date as string);
      res.json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve today's workout";
      res.status(500).json({ error: message });
    }
  };

  // Get workouts by date range
  getByDateRange = async (req: Request, res: Response) => {
    try {
      const { userId, startDate, endDate } = req.query;
      if (!userId || !startDate || !endDate) {
        return res.status(400).json({ error: "userId, startDate, and endDate are required" });
      }
      const workouts = await this.workoutService.getWorkoutsByDateRange(
        userId as string,
        startDate as string,
        endDate as string
      );
      res.json(workouts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve workouts";
      res.status(500).json({ error: message });
    }
  };

  // Get upcoming workouts
  getUpcoming = async (req: Request, res: Response) => {
    try {
      const { userId, fromDate, limit } = req.query;
      if (!userId || !fromDate) {
        return res.status(400).json({ error: "userId and fromDate are required" });
      }
      const workouts = await this.workoutService.getUpcomingWorkouts(
        userId as string,
        fromDate as string,
        limit ? parseInt(limit as string) : 5
      );
      res.json(workouts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve upcoming workouts";
      res.status(500).json({ error: message });
    }
  };

  // Get weekly stats
  getWeeklyStats = async (req: Request, res: Response) => {
    try {
      const { userId, weekStart, weekEnd } = req.query;
      if (!userId || !weekStart || !weekEnd) {
        return res.status(400).json({ error: "userId, weekStart, and weekEnd are required" });
      }
      const stats = await this.workoutService.getWeeklyStats(
        userId as string,
        weekStart as string,
        weekEnd as string
      );
      res.json(stats);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve weekly stats";
      res.status(500).json({ error: message });
    }
  };

  // Create workout
  create = async (req: Request, res: Response) => {
    try {
      const workout = await this.workoutService.createWorkout(req.body);
      res.status(201).json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create workout";
      res.status(400).json({ error: message });
    }
  };

  // Update workout
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.updateWorkout(id, req.body);
      res.json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update workout";
      res.status(400).json({ error: message });
    }
  };

  // Complete workout
  complete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.completeWorkout(id);
      res.json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to complete workout";
      res.status(404).json({ error: message });
    }
  };

  // Delete workout
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.workoutService.deleteWorkout(id);
      res.json({ message: "Workout deleted successfully" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete workout";
      res.status(404).json({ error: message });
    }
  };

  // Duplicate workout
  duplicate = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newDate } = req.body;
      if (!newDate) {
        return res.status(400).json({ error: "newDate is required" });
      }
      const workout = await this.workoutService.duplicateWorkout(id, newDate);
      res.status(201).json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to duplicate workout";
      res.status(404).json({ error: message });
    }
  };
}
