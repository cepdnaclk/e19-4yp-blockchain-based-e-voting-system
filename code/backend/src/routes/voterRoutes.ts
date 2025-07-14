import { Router } from "express";
import { voterRegistrationController } from "../controllers/voter/voterRegistrationController";
import { voterLogin } from "../controllers/voterLoginController";

const router = Router();

router.get("/registration", voterRegistrationController);

router.post("/login", (req, res) => {
  voterLogin(req, res);
});

export default router;
