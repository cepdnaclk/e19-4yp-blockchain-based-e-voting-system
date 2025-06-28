import { generateRefreshToken } from "../auth/authService";
import { dbQuery } from "../common/dbService";

export const adminLoginService = async (
  username: string
): Promise<{ refresh_token: string } | null> => {
  const refreshToken = generateRefreshToken(username);
  const query =
    "UPDATE admin_data SET refresh_token = $1 WHERE user_name = $2 RETURNING refresh_token";
  const param = [refreshToken, username];
  return (await dbQuery({ query: query, params: param })).rows[0] || null;
};
