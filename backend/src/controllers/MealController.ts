import { Request, Response } from "express";
import { z } from "zod";
import { MealService } from "../services/MealService.js";
import { MealType } from "../infrastructure/database/entities/Meal.js";

const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0)
});

const CreateMealSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: z.enum([MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(500).optional(),
  items: z.array(FoodItemSchema).optional(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0)
});

const UpdateMealSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.enum([MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  description: z.string().max(500).optional(),
  items: z.array(FoodItemSchema).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional()
});

export class MealController {
  private service: MealService;

  constructor() {
    this.service = new MealService();
  }

  list = async (req: Request, res: Response) => {
    try {
      const { userId, date } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const meals = await this.service.getMealsByUser(userId as string, date as string);
      res.json(meals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const meal = await this.service.getMealById(id);
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.json(meal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data = CreateMealSchema.parse(req.body);
      const meal = await this.service.createMeal(data);
      res.status(201).json(meal);
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
      const data = UpdateMealSchema.parse(req.body);
      const meal = await this.service.updateMeal(id, data);
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.json(meal);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.service.deleteMeal(id);
      if (!success) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getDailyTotals = async (req: Request, res: Response) => {
    try {
      const { userId, date } = req.query;
      if (!userId || !date) {
        return res.status(400).json({ error: "userId and date are required" });
      }
      const totals = await this.service.getDailyTotals(userId as string, date as string);
      res.json(totals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  deleteFoodItem = async (req: Request, res: Response) => {
    try {
      const { mealId, foodId } = req.params;
      const meal = await this.service.deleteFoodItem(mealId, foodId);
      if (!meal) {
        return res.status(404).json({ error: "Meal or food item not found" });
      }
      res.json(meal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
