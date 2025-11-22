import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, CreateUserDTO, UpdateUserDTO } from "../../domain/entities/User";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private repository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.repository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.repository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.repository.findByUsername(username);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    // Check if email already exists
    const existingEmail = await this.repository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check if username already exists
    const existingUsername = await this.repository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.repository.create({
      ...data,
      password: hashedPassword
    });
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
    // If updating email, check if it's already taken
    if (data.email) {
      const existingEmail = await this.repository.findByEmail(data.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new Error("Email already exists");
      }
    }

    // If updating username, check if it's already taken
    if (data.username) {
      const existingUsername = await this.repository.findByUsername(data.username);
      if (existingUsername && existingUsername.id !== id) {
        throw new Error("Username already exists");
      }
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.repository.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
