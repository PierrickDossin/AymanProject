import { Request, Response } from "express";
import { z } from "zod";
import { WorkoutService } from "../../../application/services/WorkoutService.js";

const CreateSchema = z.object({
  title: z.string().min(3)
});

export class WorkoutController {
  constructor(private service: WorkoutService) {}

  list = async (req: Request, res: Response) => {
    const items = await this.service.list();
    res.json(items);
  };

  create = async (req: Request, res: Response) => {
    try {
      const { title } = CreateSchema.parse(req.body);
      const created = await this.service.create(title);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid input" });
    }
  };
}
