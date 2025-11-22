import { Repository } from "typeorm";
import { AppDataSource } from "../infrastructure/database/data-source.js";
import { Meal } from "../infrastructure/database/entities/Meal.js";

export class MealRepository {
  private repository: Repository<Meal>;

  constructor() {
    this.repository = AppDataSource.getRepository(Meal);
  }

  async findAll(userId: string, date?: string) {
    const query = this.repository
      .createQueryBuilder("meal")
      .where("meal.userId = :userId", { userId });

    if (date) {
      query.andWhere("meal.date = :date", { date });
    }

    return await query.orderBy("meal.createdAt", "ASC").getMany();
  }

  async findById(id: string) {
    return await this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Meal>) {
    const meal = this.repository.create(data);
    return await this.repository.save(meal);
  }

  async update(id: string, data: Partial<Meal>) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getTotalsByDate(userId: string, date: string) {
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
