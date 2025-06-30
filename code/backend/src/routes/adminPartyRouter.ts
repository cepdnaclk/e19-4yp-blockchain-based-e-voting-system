import { Router } from "express";
import {
  createPartyController,
  getAllPartiesController,
  getPartyByIdController,
  updatePartyController,
  deletePartyController,
  getPartiesWithStatsController,
} from "../controllers/admin/adminPartyController";

const router: Router = Router();

// Create a new party
router.post("/create", createPartyController);

// Get all parties
router.get("/list", getAllPartiesController);

// Get parties with statistics
router.get("/stats", getPartiesWithStatsController);

// Get party by ID
router.get("/:id", getPartyByIdController);

// Update party
router.put("/:id", updatePartyController);

// Delete party
router.delete("/:id", deletePartyController);

export default router;
