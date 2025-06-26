import { Router } from "express";
import messages from "../constants/messages";
import adminRegisterService from "../services/admin/adminRegisterService";
import {
  generateAccessToken,
  generateRefreshToken,
  validatePasswrd,
  validateUserName,
} from "../services/authService";
import { dbQuery } from "../services/dbService";
import { sendError } from "../utils/responseHandler";

const router: Router = Router();

router.post("/register", async (req, res) => {
  const registrationAllowed = process.env.REGISTRATION_ALLOWED || false;
  if (registrationAllowed !== "true") {
    sendError(res, 403, {
      message: messages.registration.registrationIsNotAllowed,
    });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    console.error("Username or password is missing");
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

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user: {
//     id: string;
//     user_name: string;
//     password: string;
//     created_at: Date;
//   }[] = (
//     await dbQuery({
//       query: "SELECT * FROM admin_data WHERE user_name = $1",
//       params: [username],
//     })
//   ).rows;

//   if (user.length === 0) {
//     sendError(res, 401, "User not found", undefined, {
//       userName: username,
//     });
//     return;
//   }

//   const isPasswordMatch = await validatePasswrd(password, user[0].password);
//   if (isPasswordMatch) {
//     const accessToken = generateAccessToken(username);
//     const refreshToken = generateRefreshToken(username);

//     // Add refresh token to db
//     const query =
//       "UPDATE admin_data SET refresh_token = $1 WHERE user_name = $2";
//     const param = [refreshToken, username];

//     try {
//       const response = await dbQuery({ query: query, params: param });
//       res
//         .status(200)
//         .cookie("refreshToken", refreshToken, {
//           httpOnly: true,
//           secure: false,
//           sameSite: "lax",
//         })
//         .json({
//           message: "Authenticated",
//           userName: username,
//           accessToken: accessToken,
//         });
//     } catch {
//       sendError(res, 500, "Internal Server Error", undefined, undefined);
//     }
//   } else {
//     sendError(res, 401, "Password does not match", undefined, {
//       userName: username,
//     });
//   }
// });

export default router;
