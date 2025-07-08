import { Router } from "express";
import {
  registerVoter,
  voterLogin,
  getVoterProfile,
} from "../controllers/voterLoginController";
import { voterRegistrationController } from "../controllers/voter/voterRegistrationController";

const router = Router();

router.post("/registration", voterRegistrationController);

router.post("/userlogin", (req, res) => {
  voterLogin(req, res);
});

router.post("/register", (req, res) => {
  registerVoter(req, res);
});

router.get("/profile/:voter_id", (req, res) => {
  getVoterProfile(req, res);
});

export default router;
