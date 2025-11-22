import { AppDataSource } from "../infrastructure/database/data-source";
import { Workout } from "../infrastructure/database/entities/Workout";
import { Between, MoreThanOrEqual } from "typeorm";

export class WorkoutRepository {
  private repository = AppDataSource.getRepository(Workout);

  async findAll(): Promise<Workout[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Workout | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUserId(userId: string): Promise<Workout[]> {
    return this.repository.find({ 
      where: { userId },
      order: { scheduledDate: "ASC" }
    });
  }

  async findByUserAndDate(userId: string, date: string): Promise<Workout | null> {
    return this.repository.findOne({
      where: { userId, scheduledDate: date }
    });
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Workout[]> {
    return this.repository.find({
      where: {
        userId,
        scheduledDate: Between(startDate, endDate)
      },
      order: { scheduledDate: "ASC" }
    });
  }

  async findUpcoming(userId: string, fromDate: string, limit: number = 5): Promise<Workout[]> {
    return this.repository.find({
      where: {
        userId,
        scheduledDate: MoreThanOrEqual(fromDate),
        status: "planned"
      },
      order: { scheduledDate: "ASC" },
      take: limit
    });
  }

  async getWeeklyWorkouts(userId: string, weekStart: string, weekEnd: string): Promise<Workout[]> {
    return this.repository.find({
      where: {
        userId,
        scheduledDate: Between(weekStart, weekEnd)
      }
    });
  }

  async create(workoutData: Partial<Workout>): Promise<Workout> {
    const workout = this.repository.create(workoutData);
    return this.repository.save(workout);
  }

  async update(id: string, workoutData: Partial<Workout>): Promise<Workout | null> {
    await this.repository.update(id, workoutData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async markCompleted(id: string): Promise<Workout | null> {
    await this.repository.update(id, {
      status: "completed",
      completedAt: new Date()
    });
    return this.findById(id);
  }
}
