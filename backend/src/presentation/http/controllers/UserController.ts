import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "../../../application/services/UserService";

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
  password: z.string().min(6).optional(),
  avatarUrl: z.string().url().optional()
});

export class UserController {
  constructor(private service: UserService) {}

  // GET /users - Get all users
  list = async (req: Request, res: Response) => {
    try {
      const users = await this.service.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // GET /users/:id - Get user by ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.service.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  };

  // POST /users - Create new user
  create = async (req: Request, res: Response) => {
    try {
      const data = CreateUserSchema.parse(req.body);
      const user = await this.service.createUser(data);
      res.status(201).json(user);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: err.errors });
      }
      res.status(400).json({ error: err.message || "Invalid input" });
    }
  };

  // PUT /users/:id - Update user
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
      res.status(400).json({ error: err.message || "Invalid input" });
    }
  };

  // DELETE /users/:id - Delete user
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.service.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  };
}
