import express, { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middlewear/authMiddlewear";

const router: Router = express.Router();

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

// TODO: Add vote-related routes

export default router;
