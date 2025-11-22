import { Router } from "express";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Goal } from "../../../infrastructure/database/entities/Goal";

const router = Router();

// Get all goals for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const goalRepo = AppDataSource.getRepository(Goal);
    const goals = await goalRepo
      .createQueryBuilder("goal")
      .where("goal.userId = :userId", { userId })
      .orderBy("goal.createdAt", "DESC")
      .getMany();

    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// Get a single goal by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const goalRepo = AppDataSource.getRepository(Goal);
    const goal = await goalRepo.findOne({ where: { id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ error: "Failed to fetch goal" });
  }
});

// Create a new goal
router.post("/", async (req, res) => {
  try {
    const { userId, type, targetValue, currentValue, targetDate, status, notes } = req.body;

    if (!userId || !type || !targetValue) {
      return res.status(400).json({ 
        error: "userId, type, and targetValue are required" 
      });
    }

    const goalRepo = AppDataSource.getRepository(Goal);
    const goal = goalRepo.create({
      userId,
      type,
      targetValue,
      currentValue: currentValue || 0,
      targetDate,
      status: status || "active",
      notes,
    });

    const savedGoal = await goalRepo.save(goal);
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

// Update a goal
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, targetValue, currentValue, targetDate, status, notes } = req.body;

    const goalRepo = AppDataSource.getRepository(Goal);
    const goal = await goalRepo.findOne({ where: { id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    goal.type = type !== undefined ? type : goal.type;
    goal.targetValue = targetValue !== undefined ? targetValue : goal.targetValue;
    goal.currentValue = currentValue !== undefined ? currentValue : goal.currentValue;
    goal.targetDate = targetDate !== undefined ? targetDate : goal.targetDate;
    goal.status = status !== undefined ? status : goal.status;
    goal.notes = notes !== undefined ? notes : goal.notes;

    const updatedGoal = await goalRepo.save(goal);
    res.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const goalRepo = AppDataSource.getRepository(Goal);
    const result = await goalRepo.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

export default router;
