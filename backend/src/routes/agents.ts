import { Router } from "express";
import { AgentController } from "../controllers/AgentController.js";

const router = Router();
const controller = new AgentController();

router.post("/analyze", controller.analyze);

export default router;
