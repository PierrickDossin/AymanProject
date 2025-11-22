import { Request, Response } from "express";
import { ExerciseService } from "../services/ExerciseService.js";
import { exercises as seedData } from "../data/exercises.js";

export class ExerciseController {
  private exerciseService = new ExerciseService();

  // Get all exercises
  getAll = async (req: Request, res: Response) => {
    try {
      const { muscleGroup, equipment, search } = req.query;
      
      let exercises;
      if (search) {
        exercises = await this.exerciseService.searchExercises(search as string);
      } else if (muscleGroup) {
        exercises = await this.exerciseService.getExercisesByMuscleGroup(muscleGroup as string);
      } else if (equipment) {
        exercises = await this.exerciseService.getExercisesByEquipment(equipment as string);
      } else {
        exercises = await this.exerciseService.getAllExercises();
      }
      
      res.json(exercises);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve exercises";
      res.status(500).json({ error: message });
    }
  };

  // Get exercise by ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exercise = await this.exerciseService.getExerciseById(id);
      res.json(exercise);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Exercise not found";
      res.status(404).json({ error: message });
    }
  };

  // Create new exercise
  create = async (req: Request, res: Response) => {
    try {
      const exercise = await this.exerciseService.createExercise(req.body);
      res.status(201).json(exercise);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create exercise";
      res.status(400).json({ error: message });
    }
  };

  // Seed exercises from dataset
  seed = async (req: Request, res: Response) => {
    try {
      // Check if exercises already exist
      const existing = await this.exerciseService.getAllExercises();
      if (existing.length > 0) {
        return res.status(400).json({ error: "Exercises already seeded" });
      }

      const exercises = await this.exerciseService.seedExercises(seedData);
      res.status(201).json({ 
        message: `Successfully seeded ${exercises.length} exercises`,
        count: exercises.length
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to seed exercises";
      res.status(500).json({ error: message });
    }
  };

  // Update exercise
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const exercise = await this.exerciseService.updateExercise(id, req.body);
      res.json(exercise);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update exercise";
      res.status(400).json({ error: message });
    }
  };

  // Delete exercise
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.exerciseService.deleteExercise(id);
      res.json({ message: "Exercise deleted successfully" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete exercise";
      res.status(404).json({ error: message });
    }
  };
}
