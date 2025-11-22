import { Router } from "express";
import { ExerciseController } from "../controllers/ExerciseController";

const router = Router();
const controller = new ExerciseController();

// Exercise routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/seed", controller.seed);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
