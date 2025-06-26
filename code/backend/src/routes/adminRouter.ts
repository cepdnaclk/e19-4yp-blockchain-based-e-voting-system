import { Router } from "express";
import messages from "../common/constants/messages";
import { AdminUserType } from "../common/types/adminTypes";
import { getAdminUsersByUsername } from "../services/admin/adminCommonServices";
import {
  addRefreshTokenToDb,
  adminRegisterService,
} from "../services/admin/adminRegisterService";
import {
  generateAccessToken,
  generateRefreshToken,
  validatePasswrd,
  validateUserName,
} from "../services/authService";
import { sendError } from "../utils/responseHandler";

const router: Router = Router();

router.post("/register", async (req, res) => {
  const registrationAllowed = process.env.REGISTRATION_ALLOWED || false;
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
    if (await validateUserName(username)) {
      sendError(res, 409, {
        message: messages.registration.userNameExists,
        data: {
          username: username,
        },
      });
      return;
    }
    adminRegisterService(res, username, password);
  } catch (error: any) {
    console.error("Error registering user:", error);
    sendError(res, 500, { message: messages.common.error, error: error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users: AdminUserType[] = await getAdminUsersByUsername(username);

  if (users.length === 0) {
    sendError(res, 404, {
      message: messages.login.userNotFound,
      data: { username: username },
    });
    return;
  }
  if (users.length > 1) {
    sendError(res, 409, {
      message: messages.login.multipleUsersFound,
      data: { username: username },
    });
    return;
  }
  const isPasswordMatch = await validatePasswrd(password, users[0].password);

  if (isPasswordMatch) {
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);
    addRefreshTokenToDb(res, username, accessToken, refreshToken);
    return;
  } else {
    sendError(res, 401, {
      message: messages.login.passwordMismatch,
      data: { username: username },
    });
    return;
  }
});

export default router;
