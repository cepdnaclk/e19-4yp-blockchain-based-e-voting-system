import express, { Router } from "express";
import {
  validatePasswrd,
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService";
import { dbQuery } from "../services/dbService";

const router: Router = express.Router();

// Login route
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user: {
    id: string;
    user_name: string;
    password: string;
    created_at: Date;
  }[] = (
    await dbQuery({
      query: "SELECT * FROM admin_data WHERE user_name = $1",
      params: [username],
    })
  ).rows;

  if (user.length === 0) {
    res.status(401).json({ message: "User not found", userName: username });
    return;
  }

  const isPasswordMatch = await validatePasswrd(password, user[0].password);
  if (isPasswordMatch) {
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    // Add refresh token to db
    const query =
      "UPDATE admin_data SET refresh_token = $1 WHERE user_name = $2";
    const param = [refreshToken, username];

    try {
      const response = await dbQuery({ query: query, params: param });
      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days);
        })
        .json({
          message: "Authenticated",
          userName: username,
          accessToken: accessToken,
        });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res
      .status(401)
      .json({ message: "Password does not match", userName: username });
  }
});

export default router;
