import express, { Router } from "express";
import { refreshAccessToken } from "../controllers/authController";

const router: Router = express.Router();

router.post("/", refreshAccessToken);

export default router;
