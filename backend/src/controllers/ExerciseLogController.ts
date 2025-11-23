import { Request, Response } from "express";
import { AppDataSource } from "../infrastructure/database/data-source.js";
import { ExerciseLog } from "../infrastructure/database/entities/ExerciseLog.js";

export class ExerciseLogController {
  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
      const logs = await exerciseLogRepository.find({
        where: { userId },
        order: { performedAt: "DESC" },
        take: 50,
      });

      res.json(logs);
    } catch (error) {
      console.error("Error fetching exercise logs:", error);
      res.status(500).json({ error: "Failed to fetch exercise logs" });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { exerciseName } = req.params;

      const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
      const logs = await exerciseLogRepository.find({
        where: { userId, exerciseName },
        order: { performedAt: "DESC" },
        take: 10,
      });

      res.json(logs);
    } catch (error) {
      console.error("Error fetching exercise history:", error);
      res.status(500).json({ error: "Failed to fetch exercise history" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { exerciseName, weight, reps, sets, workoutType, notes } = req.body;

      if (!exerciseName || weight === undefined || !reps || !sets || !workoutType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
      const log = exerciseLogRepository.create({
        userId,
        exerciseName,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
        workoutType,
        notes,
      });

      await exerciseLogRepository.save(log);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating exercise log:", error);
      res.status(500).json({ error: "Failed to create exercise log" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.params;
      const { weight, reps, sets, notes } = req.body;

      const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
      const log = await exerciseLogRepository.findOne({ where: { id, userId } });

      if (!log) {
        return res.status(404).json({ error: "Exercise log not found" });
      }

      if (weight !== undefined) log.weight = parseFloat(weight);
      if (reps !== undefined) log.reps = parseInt(reps);
      if (sets !== undefined) log.sets = parseInt(sets);
      if (notes !== undefined) log.notes = notes;

      await exerciseLogRepository.save(log);
      res.json(log);
    } catch (error) {
      console.error("Error updating exercise log:", error);
      res.status(500).json({ error: "Failed to update exercise log" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.params;

      const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
      const log = await exerciseLogRepository.findOne({ where: { id, userId } });

      if (!log) {
        return res.status(404).json({ error: "Exercise log not found" });
      }

      await exerciseLogRepository.remove(log);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting exercise log:", error);
      res.status(500).json({ error: "Failed to delete exercise log" });
    }
  }
}
