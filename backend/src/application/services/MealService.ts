import { MealRepository } from "../../domain/repositories/MealRepository";
import { Meal, CreateMealDTO, UpdateMealDTO } from "../../domain/entities/Meal";

export class MealService {
  constructor(private repository: MealRepository) {}

  async getMealsByUser(userId: string, date?: string): Promise<Meal[]> {
    return await this.repository.findAll(userId, date);
  }

  async getMealById(id: string): Promise<Meal | null> {
    return await this.repository.findById(id);
  }

  async createMeal(data: CreateMealDTO): Promise<Meal> {
    return await this.repository.create(data);
  }

  async updateMeal(id: string, data: UpdateMealDTO): Promise<Meal | null> {
    const meal = await this.repository.findById(id);
    if (!meal) {
      throw new Error("Meal not found");
    }
    return await this.repository.update(id, data);
  }

  async deleteMeal(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async getDailyTotals(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }> {
    return await this.repository.getTotalsByDate(userId, date);
  }
}
