import { Request, Response } from "express";
import { fetchAllHashedVoterAccessKeys } from "../../services/voter/voterCommonServices";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";

export const voterCountController = async (req: Request, res: Response) => {
  try {
    const response = await fetchAllHashedVoterAccessKeys();
    const voterCount = response.length;
    sendSuccess(res, 200, {
      message: "Voter count retrieved successfully",
      data: { count: voterCount },
    });
  } catch (error) {
    console.error("Error retrieving voter count:", error);
    sendError(res, 500, { message: messages.common.internalServerError });
  }
};
