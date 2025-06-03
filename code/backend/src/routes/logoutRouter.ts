import { Router } from "express";
import { logout } from "../services/logoutService";

const router: Router = Router();

// Logout route
router.post("/", (req, res) => {
  logout(req, res);
});

export default router;
