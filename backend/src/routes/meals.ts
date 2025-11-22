import { Router } from "express";
import { MealController } from "../controllers/MealController";

const router = Router();
const controller = new MealController();

router.get("/", controller.list);
router.get("/totals", controller.getDailyTotals);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.delete("/:mealId/items/:foodId", controller.deleteFoodItem);

export default router;
