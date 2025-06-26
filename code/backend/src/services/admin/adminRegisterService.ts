import { Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { hashPassword } from "../authService";
import { dbQuery } from "../dbService";
import messages from "../../common/constants/messages";

export const adminRegisterService = async (
  res: Response,
  username: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);
  const query =
    "INSERT INTO admin_data (user_name, password) VALUES ($1, $2) RETURNING id";

  const response = await dbQuery({
    query: query,
    params: [username, hashedPassword],
  });
  sendSuccess(res, 201, {
    message: messages.registration.registrationSuccess,
    data: {
      userId: response.rows[0].id,
    },
  });
};

export const addRefreshTokenToDb = async (
  res: Response,
  username: string,
  accessToken: string,
  refreshToken: string
) => {
  const query = "UPDATE admin_data SET refresh_token = $1 WHERE user_name = $2";
  const param = [refreshToken, username];
  try {
    const response = await dbQuery({ query: query, params: param });
    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        message: "Authenticated",
        userName: username,
        accessToken: accessToken,
      });
  } catch {
    sendError(res, 500, { message: messages.common.error });
  }
};
