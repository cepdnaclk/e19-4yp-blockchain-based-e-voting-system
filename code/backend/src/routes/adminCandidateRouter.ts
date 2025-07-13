import { Router } from "express";
import {
  createCandidateController,
  getAllCandidatesController,
} from "../controllers/admin/adminCandidateController";

const router: Router = Router();

// Create a new candidate
router.post("/create", createCandidateController);

// Get all candidates
router.get("/list", getAllCandidatesController);

export default router;
