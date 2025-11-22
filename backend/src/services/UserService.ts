import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getAllUsers() {
    return await this.repository.findAll();
  }

  async getUserById(id: string) {
    return await this.repository.findById(id);
  }

  async createUser(data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    // Check if email exists
    const existingEmail = await this.repository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check if username exists
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

  async updateUser(id: string, data: Partial<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>) {
    // Check email uniqueness if updating
    if (data.email) {
      const existingEmail = await this.repository.findByEmail(data.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new Error("Email already exists");
      }
    }

    // Check username uniqueness if updating
    if (data.username) {
      const existingUsername = await this.repository.findByUsername(data.username);
      if (existingUsername && existingUsername.id !== id) {
        throw new Error("Username already exists");
      }
    }

    // Hash password if updating
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.repository.update(id, data);
  }

  async deleteUser(id: string) {
    return await this.repository.delete(id);
  }
}
