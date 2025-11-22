import { MealRepository } from "../repositories/MealRepository";
import { MealType } from "../models/Meal";

export class MealService {
  private repository: MealRepository;

  constructor() {
    this.repository = new MealRepository();
  }

  async getMealsByUser(userId: string, date?: string) {
    return await this.repository.findAll(userId, date);
  }

  async getMealById(id: string) {
    return await this.repository.findById(id);
  }

  async createMeal(data: {
    userId: string;
    name: string;
    type: MealType;
    date: string;
    description?: string;
    items?: Array<{
      id: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) {
    return await this.repository.create(data);
  }

  async updateMeal(id: string, data: Partial<{
    name: string;
    type: MealType;
    date: string;
    description: string;
    items: Array<{
      id: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>) {
    const meal = await this.repository.findById(id);
    if (!meal) {
      throw new Error("Meal not found");
    }
    return await this.repository.update(id, data);
  }

  async deleteMeal(id: string) {
    return await this.repository.delete(id);
  }

  async getDailyTotals(userId: string, date: string) {
    return await this.repository.getTotalsByDate(userId, date);
  }

  async deleteFoodItem(mealId: string, foodId: string) {
    const meal = await this.repository.findById(mealId);
    if (!meal) {
      throw new Error("Meal not found");
    }

    const items = meal.items || [];
    const updatedItems = items.filter(item => item.id !== foodId);

    if (items.length === updatedItems.length) {
      throw new Error("Food item not found");
    }

    // Recalculate totals
    const totals = updatedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return await this.repository.update(mealId, {
      items: updatedItems,
      ...totals,
    });
  }
}
