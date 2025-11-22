import { Repository } from "typeorm";
import { User as UserEntity } from "../database/entities/User.js";
import { User, CreateUserDTO, UpdateUserDTO } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { AppDataSource } from "../database/data-source.js";

export class TypeOrmUserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      select: ['id', 'username', 'firstName', 'lastName', 'email', 'avatarUrl', 'createdAt', 'updatedAt']
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      select: ['id', 'username', 'firstName', 'lastName', 'email', 'avatarUrl', 'createdAt', 'updatedAt']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email }
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username }
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
