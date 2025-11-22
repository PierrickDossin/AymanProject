import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const controller = new UserController();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.post("/login", controller.login);
router.post("/social-login", controller.socialLogin);
router.delete("/:id", controller.delete);

export default router;
