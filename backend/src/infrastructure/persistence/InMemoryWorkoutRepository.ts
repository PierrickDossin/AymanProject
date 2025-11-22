import { Workout } from "../../domain/entities/Workout.js";
import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";

export class InMemoryWorkoutRepository implements WorkoutRepository {
  private items: Workout[] = [];
  async list(): Promise<Workout[]> {
    return this.items;
  }
  async create(title: string): Promise<Workout> {
    const w: Workout = { id: Math.random().toString(36).slice(2), title, createdAt: new Date() };
    this.items.push(w);
    return w;
  }
}
