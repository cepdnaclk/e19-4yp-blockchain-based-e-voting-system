import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { adminRegisterService } from "../../services/admin/adminRegisterService";
import {
  generateAccessToken,
  validatePasswrd,
  validateUserName,
} from "../../services/auth/authService";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { AdminUserType } from "../../common/types/adminTypes";
import { getAdminUsersByUsername } from "../../services/admin/adminCommonServices";
import { adminLoginService } from "../../services/admin/adminLoginService";
import { adminLogoutService } from "../../services/admin/adminLogoutService";
import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import { blockchainFetchByKey } from "../../services/blockchain/blockchainServices";

export const adminRegisterController = async (req: Request, res: Response) => {
  const registrationAllowed = process.env.ADMIN_REGISTRATION_ALLOWED || false;
  const { username, password } = req.body;

  if (registrationAllowed !== "true") {
    sendError(res, 403, {
      message: messages.registration.registrationIsNotAllowed,
    });
    return;
  }

  if (!username || !password) {
    console.error(messages.registration.userNamePasswordRequired);
    sendError(res, 400, {
      message: messages.registration.userNamePasswordRequired,
    });
    return;
  }

  try {
    const adminDataHistory = await blockchainFetchByKey("admin", true);
    const userNames = adminDataHistory.result?.map((item) => {
      const value = JSON.parse(item.value);
      return value.username;
    });
    const userNameExists = userNames?.find((name) => name === username);

    if (userNameExists) {
      sendError(res, 409, {
        message: messages.registration.userNameExists,
        data: {
          username: username,
        },
      });
      return;
    }
    const response: blockchainResponseType = await adminRegisterService(
      username,
      password
    );

    const responseValue: { username: string; hashedPassword: string } =
      response.result ? JSON.parse(response?.result[0].value) : null;

    sendSuccess(res, 201, {
      message: messages.registration.registrationSuccess,
      data: {
        username: responseValue.username,
      },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    sendError(res, 500, { message: messages.common.error, error: error });
  }
};

export const adminLoginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user: AdminUserType | null = await getAdminUsersByUsername(username);

    if (user === null) {
      sendError(res, 404, {
        message: messages.login.userNotFound,
        data: { username: username },
      });
      return;
    }

    const isPasswordMatch = await validatePasswrd(
      password,
      user.hashedPassword
    );

    if (isPasswordMatch) {
      const accessToken = generateAccessToken(username);
      const refreshToken: string | null =
        (await adminLoginService(username))?.refresh_token || null;

      if (refreshToken === null) {
        sendError(res, 500, { message: messages.common.error });
        return;
      }

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
      return;
    } else {
      sendError(res, 401, {
        message: messages.login.passwordMismatch,
        data: { username: username },
      });
      return;
    }
  } catch (error: any) {
    console.error("Error during admin login:", error);
    sendError(res, 500, { message: messages.common.error });
  }
};

export const adminLogoutController = async (req: Request, res: Response) => {
  try {
    const response: { userName: string } | null = await adminLogoutService(req);
    if (response !== null) {
      sendSuccess(res, 200, {
        message: "Logout successful",
      });
      return;
    } else {
      sendError(res, 404, {
        message: "User not found",
      });
      return;
    }
  } catch (error: any) {
    console.error("Error during admin logout:", error);
    sendError(res, 500, { message: messages.common.error });
    return;
  }
};
