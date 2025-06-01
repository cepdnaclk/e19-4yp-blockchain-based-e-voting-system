import express from "express";
import { Router } from "express";
import { hashPassword } from "../services/authService";
import dotenv from "dotenv";
dotenv.config();

const router: Router = express.Router();

const db = require("../models/db");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  try {
    const hashedPassword = await hashPassword(password);
    const query =
      "INSERT INTO admin_data (user_name, password) VALUES ($1, $2) RETURNING id";
    const response = await db.query(query, [username, hashedPassword]);
    res
      .status(201)
      .json({ message: "User registered successfully", userId: response.rows });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
