import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../../application/services/UserService";
import { TypeOrmUserRepository } from "../../../infrastructure/persistence/TypeOrmUserRepository";

const router = Router();

const repository = new TypeOrmUserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
