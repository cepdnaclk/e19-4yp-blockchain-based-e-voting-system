import express, { Request, Response } from "express";
import { Router } from "express";
import {
  getCandidates,
  castVote,
  getResults,
} from "../controllers/voteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Status route
router.get("/status", authMiddleware, (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: "Voting system is active" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Root route for testing
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Vote routes are working" });
});

// Get all candidates
router.get("/candidates", getCandidates);

// Cast a vote
router.post("/cast", (req, res) => {
  castVote(req, res);
});

// Get voting results
router.get("/results", getResults);

export default router;
