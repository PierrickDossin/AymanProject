import { Router } from "express";
import { MealController } from "../controllers/MealController";
import { MealService } from "../../../application/services/MealService";
import { TypeOrmMealRepository } from "../../../infrastructure/persistence/TypeOrmMealRepository";

const router = Router();

const repository = new TypeOrmMealRepository();
const service = new MealService(repository);
const controller = new MealController(service);

router.get("/", controller.list);
router.get("/totals", controller.getDailyTotals);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
