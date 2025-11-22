import { Repository } from "typeorm";
import { AppDataSource } from "../infrastructure/database/data-source.js";
import { User } from "../infrastructure/database/entities/User.js";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll() {
    return await this.repository.find({
      select: ['id', 'username', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt']
    });
  }

  async findById(id: string) {
    return await this.repository.findOne({
      where: { id },
      select: ['id', 'username', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt']
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return await this.repository.findOne({ where: { username } });
  }

  async create(data: Partial<User>) {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async update(id: string, data: Partial<User>) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
