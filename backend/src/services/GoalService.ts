import { GoalRepository } from "../repositories/GoalRepository.js";
import { GoalType, GoalMetric } from "../infrastructure/database/entities/Goal.js";

export class GoalService {
  private repository: GoalRepository;

  constructor() {
    this.repository = new GoalRepository();
  }

  async getGoalsByUser(userId: string) {
    return await this.repository.findAll(userId);
  }

  async getGoalById(id: string) {
    return await this.repository.findById(id);
  }

  async getGoalsByType(userId: string, type: GoalType) {
    return await this.repository.findByType(userId, type);
  }

  async getActiveGoals(userId: string) {
    return await this.repository.findActiveGoals(userId);
  }

  async createGoal(data: {
    userId: string;
    name: string;
    type: GoalType;
    exerciseName?: string;
    description?: string;
    currentValue: number;
    goalValue: number;
    metric: GoalMetric;
    targetDate?: string;
  }) {
    return await this.repository.create({
      ...data,
      status: "active"
    });
  }

  async updateGoal(id: string, data: Partial<{
    name: string;
    exerciseName: string;
    description: string;
    currentValue: number;
    goalValue: number;
    metric: GoalMetric;
    targetDate: string;
    status: string;
  }>) {
    const goal = await this.repository.findById(id);
    if (!goal) {
      throw new Error("Goal not found");
    }
    return await this.repository.update(id, data);
  }

  async updateProgress(id: string, currentValue: number) {
    return await this.repository.updateProgress(id, currentValue);
  }

  async deleteGoal(id: string) {
    return await this.repository.delete(id);
  }

  async calculateProgress(id: string) {
    const goal = await this.repository.findById(id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    const current = goal.currentValue;
    const target = goal.goalValue;
    const diff = Math.abs(target - current);
    const totalDiff = Math.abs(target - current);
    
    let progressPercentage = 0;
    
    if (goal.type === "muscle_mass" || goal.type === "performance") {
      // For increasing goals
      progressPercentage = (current / target) * 100;
    } else {
      // For weight/body_fat (can be increase or decrease)
      if (current === target) {
        progressPercentage = 100;
      } else {
        const progress = Math.max(0, 100 - (diff / Math.abs(target) * 100));
        progressPercentage = progress;
      }
    }

    return {
      goal,
      currentValue: current,
      goalValue: target,
      difference: target - current,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      isCompleted: goal.status === "completed"
    };
  }
}
