import { Request, Response } from "express";
import { z } from "zod";
import { GoalService } from "../services/GoalService.js";
import { GoalType, GoalMetric } from "../infrastructure/database/entities/Goal.js";

const CreateGoalSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: z.enum([GoalType.MUSCLE_MASS, GoalType.WEIGHT, GoalType.PERFORMANCE, GoalType.BODY_FAT]),
  exerciseName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  currentValue: z.number(),
  goalValue: z.number(),
  metric: z.enum([GoalMetric.KILOGRAMS, GoalMetric.POUNDS, GoalMetric.PERCENTAGE, GoalMetric.REPS, GoalMetric.SECONDS, GoalMetric.MINUTES]),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

const UpdateGoalSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  exerciseName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  currentValue: z.number().optional(),
  goalValue: z.number().optional(),
  metric: z.enum([GoalMetric.KILOGRAMS, GoalMetric.POUNDS, GoalMetric.PERCENTAGE, GoalMetric.REPS, GoalMetric.SECONDS, GoalMetric.MINUTES]).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.string().optional()
});

const UpdateProgressSchema = z.object({
  currentValue: z.number()
});

export class GoalController {
  private service: GoalService;

  constructor() {
    this.service = new GoalService();
  }

  list = async (req: Request, res: Response) => {
    try {
      const { userId, type, status } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      let goals;
      if (type) {
        goals = await this.service.getGoalsByType(userId as string, type as GoalType);
      } else if (status === "active") {
        goals = await this.service.getActiveGoals(userId as string);
      } else {
        goals = await this.service.getGoalsByUser(userId as string);
      }

      res.json(goals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const goal = await this.service.getGoalById(id);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data = CreateGoalSchema.parse(req.body);
      const goal = await this.service.createGoal(data);
      res.status(201).json(goal);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = UpdateGoalSchema.parse(req.body);
      const goal = await this.service.updateGoal(id, data);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  updateProgress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { currentValue } = UpdateProgressSchema.parse(req.body);
      const goal = await this.service.updateProgress(id, currentValue);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  getProgress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const progress = await this.service.calculateProgress(id);
      res.json(progress);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.service.deleteGoal(id);
      if (!success) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
