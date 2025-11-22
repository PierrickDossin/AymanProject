import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "../application/services/UserService";
import { TypeOrmUserRepository } from "../infrastructure/persistence/TypeOrmUserRepository";

const CreateUserSchema = z.object({
  username: z.string().min(3).max(50),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6)
});

const UpdateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class UserController {
  private service: UserService;

  constructor() {
    const userRepo = new TypeOrmUserRepository();
    this.service = new UserService(userRepo);
  }

  list = async (req: Request, res: Response) => {
    try {
      const users = await this.service.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.service.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data = CreateUserSchema.parse(req.body);
      const user = await this.service.createUser(data);
      res.status(201).json(user);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = UpdateUserSchema.parse(req.body);
      const user = await this.service.updateUser(id, data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.service.deleteUser(id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const user = await this.service.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await this.service.validatePassword(user, password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(500).json({ error: err.message });
    }
  };
  socialLogin = async (req: Request, res: Response) => {
    try {
      const { provider, email, name } = req.body;
      // Try to find user by email
      let user = await this.service.getUserByEmail(email);

      if (!user) {
        // Create new user if not exists (password is random since they use social)
        const randomPassword = Math.random().toString(36).slice(-8);
        const [firstName, lastName] = name.split(" ");
        user = await this.service.createUser({
          email,
          username: email.split("@")[0],
          firstName: firstName || "Social",
          lastName: lastName || "User",
          password: randomPassword
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
