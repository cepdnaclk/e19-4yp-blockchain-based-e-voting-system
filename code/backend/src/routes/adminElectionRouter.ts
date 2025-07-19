import { Router } from "express";
import {
  createNewElectionController,
  getAllElectionsController,
} from "../controllers/admin/adminElectionController";

const router: Router = Router();

// Create a new election
router.post("/create", createNewElectionController);

// // Get all elections
router.get("/list", getAllElectionsController);

export default router;
