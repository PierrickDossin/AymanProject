import { Exercise } from "../infrastructure/database/entities/Exercise.js";
import { ExerciseRepository } from "../repositories/ExerciseRepository.js";

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.findAll();
  }

  async getExerciseById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return exercise;
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByMuscleGroup(muscleGroup);
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByEquipment(equipment);
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    return this.exerciseRepository.search(query);
  }

  async createExercise(exerciseData: Partial<Exercise>): Promise<Exercise> {
    return this.exerciseRepository.create(exerciseData);
  }

  async seedExercises(exercisesData: Partial<Exercise>[]): Promise<Exercise[]> {
    return this.exerciseRepository.createMany(exercisesData);
  }

  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    const exercise = await this.exerciseRepository.update(id, exerciseData);
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    const deleted = await this.exerciseRepository.delete(id);
    if (!deleted) {
      throw new Error("Exercise not found");
    }
  }
}
