import { Workout } from "../entities/Workout.js";

export interface WorkoutRepository {
  list(): Promise<Workout[]>;
  create(title: string): Promise<Workout>;
}
