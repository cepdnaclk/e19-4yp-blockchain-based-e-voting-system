import { Router } from "express";
import {
  adminLoginController,
  adminLogoutController,
  adminRegisterController,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/register", adminRegisterController);

router.post("/login", adminLoginController);

router.post("/logout", authMiddleware, adminLogoutController);

export default router;
