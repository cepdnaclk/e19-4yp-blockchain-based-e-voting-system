import { Request, Response } from "express";
import dotenv from "dotenv";
import { dbQuery } from "../services/dbService";
import { generateAccessToken } from "../services/authService";

const jwt = require("jsonwebtoken");

dotenv.config();

const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const username = decoded.username;
    const query = "SELECT refresh_token FROM admin_data WHERE user_name = $1";
    const params = [username];

    const db_stored_refresh_token = (
      await dbQuery({
        query: query,
        params: params,
      })
    ).rows[0].refresh_token;

    if (db_stored_refresh_token === refreshToken) {
      const accessToken = generateAccessToken(username);
      res
        .status(201)
        .json({ message: "Access Token", accessToken: accessToken });
    } else {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
