import { Repository } from "typeorm";
import { AppDataSource } from "../infrastructure/database/data-source.js";
import { Goal } from "../infrastructure/database/entities/Goal.js";

export class GoalRepository {
  private repository: Repository<Goal>;

  constructor() {
    this.repository = AppDataSource.getRepository(Goal);
  }

  async findAll(userId: string) {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: "DESC" }
    });
  }

  async findById(id: string) {
    return await this.repository.findOne({ where: { id } });
  }

  async findByType(userId: string, type: string) {
    return await this.repository.find({
      where: { userId, type: type as any },
      order: { createdAt: "DESC" }
    });
  }

  async findActiveGoals(userId: string) {
    return await this.repository.find({
      where: { userId, status: "active" },
      order: { createdAt: "DESC" }
    });
  }

  async create(data: Partial<Goal>) {
    const goal = this.repository.create(data);
    return await this.repository.save(goal);
  }

  async update(id: string, data: Partial<Goal>) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateProgress(id: string, currentValue: number) {
    const goal = await this.findById(id);
    if (!goal) return null;

    // Check if goal is completed
    const isCompleted = this.checkGoalCompletion(goal.type, currentValue, goal.goalValue);
    
    await this.repository.update(id, {
      currentValue,
      status: isCompleted ? "completed" : goal.status
    });
    
    return await this.findById(id);
  }

  private checkGoalCompletion(type: string, current: number, target: number): boolean {
    switch (type) {
      case "weight":
      case "body_fat":
        // For weight/body_fat, goal can be to decrease or increase
        return Math.abs(current - target) <= 0.5; // Within 0.5 units
      case "muscle_mass":
      case "performance":
        // For muscle/performance, goal is usually to increase
        return current >= target;
      default:
        return current >= target;
    }
  }
}
