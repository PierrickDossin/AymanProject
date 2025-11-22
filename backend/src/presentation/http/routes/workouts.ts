import { Router } from "express";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Workout } from "../../../infrastructure/database/entities/Workout";

const router = Router();

// Get all workouts for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const workoutRepo = AppDataSource.getRepository(Workout);
    const workouts = await workoutRepo
      .createQueryBuilder("workout")
      .where("workout.userId = :userId", { userId })
      .orderBy("workout.scheduledDate", "DESC")
      .getMany();

    res.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// Get a single workout by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const workoutRepo = AppDataSource.getRepository(Workout);
    const workout = await workoutRepo.findOne({ where: { id } });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
});

// Create a new workout
router.post("/", async (req, res) => {
  try {
    const { userId, name, scheduledDate, totalDuration, exercises } = req.body;

    if (!userId || !name || !scheduledDate) {
      return res.status(400).json({ 
        error: "userId, name, and scheduledDate are required" 
      });
    }

    const workoutRepo = AppDataSource.getRepository(Workout);
    const workout = workoutRepo.create({
      userId,
      name,
      scheduledDate,
      totalDuration: totalDuration || 0,
      exercises: exercises || [],
    });

    const savedWorkout = await workoutRepo.save(workout);
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).json({ error: "Failed to create workout" });
  }
});

// Update a workout
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, scheduledDate, totalDuration, exercises } = req.body;

    const workoutRepo = AppDataSource.getRepository(Workout);
    const workout = await workoutRepo.findOne({ where: { id } });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    workout.name = name !== undefined ? name : workout.name;
    workout.scheduledDate = scheduledDate !== undefined ? scheduledDate : workout.scheduledDate;
    workout.totalDuration = totalDuration !== undefined ? totalDuration : workout.totalDuration;
    workout.exercises = exercises !== undefined ? exercises : workout.exercises;

    const updatedWorkout = await workoutRepo.save(workout);
    res.json(updatedWorkout);
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ error: "Failed to update workout" });
  }
});

// Delete a workout
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const workoutRepo = AppDataSource.getRepository(Workout);
    const result = await workoutRepo.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

export default router;

