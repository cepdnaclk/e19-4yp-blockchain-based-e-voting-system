import express from "express";
import { Router } from "express";
import { hashPassword, validateUserName } from "../services/authService";
import { dbQuery } from "../services/dbService";

const router: Router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    if (await validateUserName(username)) {
      res
        .status(500)
        .json({ message: "User name already exists", username: username });
      return;
    }
    const hashedPassword = await hashPassword(password);
    const query =
      "INSERT INTO admin_data (user_name, password) VALUES ($1, $2) RETURNING id";

    const response = await dbQuery({
      query: query,
      params: [username, hashedPassword],
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: response.rows });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
