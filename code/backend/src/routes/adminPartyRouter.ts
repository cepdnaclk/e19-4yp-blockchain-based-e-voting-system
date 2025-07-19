import { Router } from "express";
import {
  createPartyController,
  getAllPartiesController,
} from "../controllers/admin/adminPartyController";

const router: Router = Router();

// Create a new party
router.post("/create", createPartyController);

// Get all parties
router.get("/list", getAllPartiesController);

export default router;
