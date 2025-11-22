import { Workout } from "../entities/Workout";

export interface WorkoutRepository {
  list(): Promise<Workout[]>;
  create(title: string): Promise<Workout>;
}
