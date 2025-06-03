import { Request, Response } from "express";
import { dbQuery } from "./dbService";
import { getAccessTokeContent } from "./authService";

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessTokenContent = getAccessTokeContent(
      req.headers.authorization || ""
    );
    const query =
      "UPDATE admin_data SET refresh_token = NULL WHERE user_name = $1 RETURNING user_name";
    const params = [accessTokenContent.username];
    const response = (await dbQuery({ query, params })).rows;
    if (response.length > 0) {
      res.status(200).json({ status: 200, message: "Logout successful" });
      return;
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
      return;
    }
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
    return;
  }
};
