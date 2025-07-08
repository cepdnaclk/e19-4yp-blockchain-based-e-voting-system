import { Router } from "express";
import {
  adminLoginController,
  adminLogoutController,
  adminRegisterController,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middleware/authMiddleware";
import electionRouter from "./adminElectionRouter";
import partyRouter from "./adminPartyRouter";
import candidateRouter from "./adminCandidateRouter";

const router: Router = Router();

router.post("/register", adminRegisterController);

router.post("/login", adminLoginController);

router.post("/logout", authMiddleware, adminLogoutController);

router.use("/election", authMiddleware, electionRouter);

router.use("/party", authMiddleware, partyRouter);

router.use("/candidate", authMiddleware, candidateRouter);

export default router;
