import { AppDataSource } from "../infrastructure/database/data-source.js";
import { Exercise } from "../infrastructure/database/entities/Exercise.js";

export class ExerciseRepository {
  private repository = AppDataSource.getRepository(Exercise);

  async findAll(): Promise<Exercise[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Exercise | null> {
    return this.repository.findOneBy({ id });
  }

  async findByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return this.repository.find({ where: { muscleGroup } });
  }

  async findByEquipment(equipment: string): Promise<Exercise[]> {
    return this.repository.find({ where: { equipment } });
  }

  async create(exerciseData: Partial<Exercise>): Promise<Exercise> {
    const exercise = this.repository.create(exerciseData);
    return this.repository.save(exercise);
  }

  async createMany(exercisesData: Partial<Exercise>[]): Promise<Exercise[]> {
    const exercises = this.repository.create(exercisesData);
    return this.repository.save(exercises);
  }

  async update(id: string, exerciseData: Partial<Exercise>): Promise<Exercise | null> {
    await this.repository.update(id, exerciseData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async search(query: string): Promise<Exercise[]> {
    return this.repository
      .createQueryBuilder("exercise")
      .where("LOWER(exercise.name) LIKE LOWER(:query)", { query: `%${query}%` })
      .orWhere("LOWER(exercise.muscleGroup) LIKE LOWER(:query)", { query: `%${query}%` })
      .orWhere("LOWER(exercise.equipment) LIKE LOWER(:query)", { query: `%${query}%` })
      .getMany();
  }
}
