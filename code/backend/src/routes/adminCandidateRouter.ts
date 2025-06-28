import { Router } from "express";
import {
  createCandidateController,
  getAllCandidatesController,
  getCandidateByIdController,
  getCandidatesByElectionController,
  getCandidatesByPartyController,
  updateCandidateController,
  deleteCandidateController,
  getCandidatesWithStatsController,
} from "../controllers/admin/adminCandidateController";

const router: Router = Router();

// Create a new candidate
router.post("/create", createCandidateController);

// Get all candidates
router.get("/list", getAllCandidatesController);

// Get candidates with statistics
router.get("/stats", getCandidatesWithStatsController);

// Get candidates by election
router.get("/election/:electionId", getCandidatesByElectionController);

// Get candidates by party
router.get("/party/:partyId", getCandidatesByPartyController);

// Get candidate by ID
router.get("/:id", getCandidateByIdController);

// Update candidate
router.put("/:id", updateCandidateController);

// Delete candidate
router.delete("/:id", deleteCandidateController);

export default router;
