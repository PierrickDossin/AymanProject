import { Router } from "express";
import { ExerciseLogController } from "../controllers/ExerciseLogController.js";

const router = Router();
const controller = new ExerciseLogController();

router.get("/", controller.list);
router.get("/history/:exerciseName", controller.getHistory);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
