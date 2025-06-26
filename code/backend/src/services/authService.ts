import bcrypt from "bcrypt";
import { dbQuery } from "./dbService";
import dotenv from "dotenv";

dotenv.config();

const jwt = require("jsonwebtoken");

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validateUserName = async (username: string): Promise<boolean> => {
  const matchingResultsCount: number = (
    await dbQuery({
      query: "SELECT COUNT(*) FROM admin_data WHERE user_name = $1",
      params: [username],
    })
  ).rows[0].count;
  return matchingResultsCount > 0;
};

export const validatePasswrd = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatch;
};

export const generateAccessToken = (username: string): string => {
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN?.toString();
  const accessToken = jwt.sign({ username }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: expiresIn || "15m",
  });
  return accessToken.toString();
};

export const generateRefreshToken = (username: string): string => {
  const refreshToken = jwt.sign({ username }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN?.toString() || "30d",
  });
  return refreshToken.toString();
};

export const getAccessTokeContent = (
  accessToken: string
): { username: string | null } => {
  try {
    const res = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return { username: res.username };
  } catch (err) {
    console.error(err);
    return { username: null };
  }
};
