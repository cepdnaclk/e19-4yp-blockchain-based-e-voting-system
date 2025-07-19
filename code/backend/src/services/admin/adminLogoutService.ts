import { Request } from "express";
import { getAccessTokeContent } from "../auth/authService";
import { dbQuery } from "../common/dbService";

export const adminLogoutService = async (
  req: Request
): Promise<{ userName: string } | null> => {
  const accessTokenContent = getAccessTokeContent(
    req.headers.authorization || ""
  );
  const query =
    "UPDATE admin_data SET refresh_token = NULL WHERE user_name = $1 RETURNING user_name";
  const params = [accessTokenContent.username];
  const response: { user_name: string } = (await dbQuery({ query, params }))
    .rows[0];
  return response ? { userName: response.user_name } : null;
};
