import { Router } from "express";
import { WorkoutController } from "../controllers/WorkoutController";

const router = Router();
const controller = new WorkoutController();

// Workout routes
router.get("/", controller.getByUser);
router.get("/today", controller.getToday);
router.get("/upcoming", controller.getUpcoming);
router.get("/range", controller.getByDateRange);
router.get("/stats/weekly", controller.getWeeklyStats);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/complete", controller.complete);
router.post("/:id/duplicate", controller.duplicate);
router.delete("/:id", controller.delete);

export default router;
