import { Router, Request, Response } from "express";
import { AppDataSource } from "../../../infrastructure/database/data-source.js";
import { ExerciseLog } from "../../../infrastructure/database/entities/ExerciseLog.js";

const router = Router();

// Get exercise history for a specific exercise
router.get("/history/:exerciseName", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const { exerciseName } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
    const logs = await exerciseLogRepository.find({
      where: { userId: userId as string, exerciseName },
      order: { performedAt: "DESC" },
      take: 10, // Last 10 performances
    });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    res.status(500).json({ error: "Failed to fetch exercise history" });
  }
});

// Get all exercise logs for user
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
    const logs = await exerciseLogRepository.find({
      where: { userId: userId as string },
      order: { performedAt: "DESC" },
      take: 50,
    });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching exercise logs:", error);
    res.status(500).json({ error: "Failed to fetch exercise logs" });
  }
});

// Log a new exercise performance
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, exerciseName, weight, reps, sets, workoutType, notes } = req.body;

    if (!userId || !exerciseName || weight === undefined || !reps || !sets || !workoutType) {
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
});

// Update an exercise log
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, weight, reps, sets, notes } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
    const log = await exerciseLogRepository.findOne({ where: { id, userId: userId as string } });

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
});

// Delete an exercise log
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const exerciseLogRepository = AppDataSource.getRepository(ExerciseLog);
    const log = await exerciseLogRepository.findOne({ where: { id, userId: userId as string } });

    if (!log) {
      return res.status(404).json({ error: "Exercise log not found" });
    }

    await exerciseLogRepository.remove(log);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting exercise log:", error);
    res.status(500).json({ error: "Failed to delete exercise log" });
  }
});

export default router;
