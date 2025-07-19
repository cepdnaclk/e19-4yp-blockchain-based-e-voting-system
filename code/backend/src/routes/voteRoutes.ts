import { Request, Response, Router } from "express";
import { getAllElectionsController } from "../controllers/admin/adminElectionController";
import { getAllPartiesController } from "../controllers/admin/adminPartyController";
import {
  getCandidatesForVotingController,
  voteCountController,
} from "../controllers/vote/voteCommonController";
import { castVote } from "../controllers/vote/voteCastController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Status route
router.get("/status", authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ status: "Voting system is active" });
});

// Cast a vote
router.post("/cast", castVote);

router.get("/count", voteCountController);

router.get("/candidates", getCandidatesForVotingController);

router.get("/parties", getAllPartiesController);

router.get("/elections", getAllElectionsController);

// Get voting results
// router.get("/results", getResults);

export default router;
