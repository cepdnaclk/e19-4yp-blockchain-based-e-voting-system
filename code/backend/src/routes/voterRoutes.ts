import { Router } from "express";
import { voterCountController } from "../controllers/voter/voterCommonController";
import { voterLoginController } from "../controllers/voter/voterLoginController";
import { voterRegistrationController } from "../controllers/voter/voterRegistrationController";

const router = Router();

router.get("/registration", voterRegistrationController);

router.post("/login", voterLoginController);

router.get("/count", voterCountController);

export default router;
