import { Router } from "express";
import { GoalController } from "../controllers/GoalController.js";

const router = Router();
const controller = new GoalController();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.get("/:id/progress", controller.getProgress);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/progress", controller.updateProgress);
router.delete("/:id", controller.delete);

export default router;
