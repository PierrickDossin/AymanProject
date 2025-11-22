import { Repository } from "typeorm";
import { Meal as MealEntity } from "../database/entities/Meal.js";
import { Meal, CreateMealDTO, UpdateMealDTO } from "../../domain/entities/Meal.js";
import { MealRepository } from "../../domain/repositories/MealRepository.js";
import { AppDataSource } from "../database/data-source.js";

export class TypeOrmMealRepository implements MealRepository {
  private repository: Repository<MealEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(MealEntity);
  }

  async findAll(userId: string, date?: string): Promise<Meal[]> {
    const query = this.repository
      .createQueryBuilder("meal")
      .where("meal.userId = :userId", { userId });

    if (date) {
      query.andWhere("meal.date = :date", { date });
    }

    return await query.orderBy("meal.createdAt", "ASC").getMany();
  }

  async findById(id: string): Promise<Meal | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async create(data: CreateMealDTO): Promise<Meal> {
    const meal = this.repository.create(data);
    return await this.repository.save(meal);
  }

  async update(id: string, data: UpdateMealDTO): Promise<Meal | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getTotalsByDate(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }> {
    const result = await this.repository
      .createQueryBuilder("meal")
      .select("SUM(meal.calories)", "totalCalories")
      .addSelect("SUM(meal.protein)", "totalProtein")
      .addSelect("SUM(meal.carbs)", "totalCarbs")
      .addSelect("SUM(meal.fat)", "totalFat")
      .where("meal.userId = :userId", { userId })
      .andWhere("meal.date = :date", { date })
      .getRawOne();

    return {
      totalCalories: result.totalCalories || 0,
      totalProtein: result.totalProtein || 0,
      totalCarbs: result.totalCarbs || 0,
      totalFat: result.totalFat || 0,
    };
  }
}
