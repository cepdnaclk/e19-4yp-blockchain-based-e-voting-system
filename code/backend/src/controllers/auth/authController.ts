import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../../services/auth/authService";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    sendError(res, 401, { message: messages.auth.refreshTokenNotFound });
    return;
  }

  try {
    const { isRefreshTokenValid, username } = await verifyRefreshToken(
      refreshToken
    );
    if (isRefreshTokenValid) {
      const accessToken = generateAccessToken(username);
      sendSuccess(res, 201, {
        message: "Access Token",
        data: accessToken,
      });
      return;
    } else {
      sendError(res, 403, { message: "Invalid refresh token" });
      return;
    }
  } catch (error) {
    console.log(error);
    sendError(res, 500, { message: messages.common.error });
  }
};
