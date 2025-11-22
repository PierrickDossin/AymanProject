import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository.js";

export class WorkoutService {
  constructor(private repo: WorkoutRepository) {}
  list() {
    return this.repo.list();
  }
  create(title: string) {
    if (!title || title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters");
    }
    return this.repo.create(title.trim());
  }
}
