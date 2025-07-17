import bcrypt from "bcrypt";
import { dbQuery } from "../common/dbService";

const jwt = require("jsonwebtoken");

const accessTokenSecret: string = process.env.JWT_ACCESS_SECRET || "";
const refreshTokenSecret: string = process.env.JWT_REFRESH_SECRET || "";
const accessTokenExpiresIn: string =
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN?.toString() || "15m";
const refreshTokenExpiresIn: string =
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN?.toString() || "30d";

export const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedInput = await bcrypt.hash(input, salt);
  return hashedInput;
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

export const validateHash = async (
  input: string,
  hashedInput: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(input, hashedInput);
  return isMatch;
};

export const generateAccessToken = (username: string): string => {
  const accessToken = jwt.sign({ username: username }, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });
  return accessToken;
};

export const generateRefreshToken = (username: string): string => {
  const refreshToken = jwt.sign({ username: username }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });
  return refreshToken;
};

export const getAccessTokeContent = (
  accessToken: string
): { username: string | null } => {
  try {
    const accessTokenSplitted = accessToken.split("Bearer ")[1];
    const res: any = jwt.verify(accessTokenSplitted, accessTokenSecret);
    return { username: res.username };
  } catch (err) {
    console.error(err);
    return { username: null };
  }
};

export const verifyRefreshToken = async (
  refreshToken: string
): Promise<{ isRefreshTokenValid: boolean; username: string }> => {
  const decoded: any = jwt.verify(refreshToken, refreshTokenSecret);
  const username = decoded.username;
  const query = "SELECT refresh_token FROM admin_data WHERE user_name = $1";
  const params = [username];

  const db_stored_refresh_token = (
    await dbQuery({
      query: query,
      params: params,
    })
  ).rows[0].refresh_token;

  return {
    isRefreshTokenValid: db_stored_refresh_token === refreshToken,
    username: username,
  };
};
