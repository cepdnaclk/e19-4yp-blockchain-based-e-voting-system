import { Router } from "express";
import {
  createNewElectionController,
  getAllElectionsController,
  getElectionByIdController,
  updateElectionController,
  deleteElectionController,
  getElectionsWithStatsController,
  getActiveElectionsController,
  getUpcomingElectionsController,
  getCompletedElectionsController,
} from "../controllers/admin/adminElectionController";

const router: Router = Router();

// Create a new election
router.post("/create", createNewElectionController);

// // Get all elections
router.get("/list", getAllElectionsController);

// Get elections with statistics
router.get("/stats", getElectionsWithStatsController);

// Get active elections
router.get("/active", getActiveElectionsController);

// Get upcoming elections
router.get("/upcoming", getUpcomingElectionsController);

// Get completed elections
router.get("/completed", getCompletedElectionsController);

// Get election by ID
router.get("/:id", getElectionByIdController);

// Update election
router.put("/:id", updateElectionController);

// Delete election
router.delete("/:id", deleteElectionController);

export default router;
