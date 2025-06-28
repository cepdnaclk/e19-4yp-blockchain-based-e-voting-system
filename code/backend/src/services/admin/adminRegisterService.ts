import { Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { hashPassword } from "../auth/authService";
import { dbQuery } from "../common/dbService";
import messages from "../../common/constants/messages";

export const adminRegisterService = async (
  username: string,
  password: string
): Promise<{ id: number }> => {
  const hashedPassword = await hashPassword(password);
  const query =
    "INSERT INTO admin_data (user_name, password) VALUES ($1, $2) RETURNING id";

  const response = (
    await dbQuery({
      query: query,
      params: [username, hashedPassword],
    })
  ).rows[0];
  return response;
};
