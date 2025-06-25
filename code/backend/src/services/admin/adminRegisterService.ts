import { Response } from "express";
import { sendSuccess } from "../../utils/responseHandler";
import { hashPassword } from "../authService";
import { dbQuery } from "../dbService";
import messages from "../../constants/messages";

const adminRegisterService = async (
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

export default adminRegisterService;
