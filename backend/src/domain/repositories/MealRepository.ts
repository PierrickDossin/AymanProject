import { Meal, CreateMealDTO, UpdateMealDTO } from "../entities/Meal";

export interface MealRepository {
  findAll(userId: string, date?: string): Promise<Meal[]>;
  findById(id: string): Promise<Meal | null>;
  create(data: CreateMealDTO): Promise<Meal>;
  update(id: string, data: UpdateMealDTO): Promise<Meal | null>;
  delete(id: string): Promise<boolean>;
  getTotalsByDate(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }>;
}
