import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { voterLoginService } from "../../services/voter/voterLoginService";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const voterLoginController = async (req: Request, res: Response) => {
  try {
    const { votersKey, pollingStationKey } = req.body;
    if (!votersKey) {
      return sendError(res, 400, {
        message: messages.voter.votersSecretKeyMissing,
      });
    }

    if (!pollingStationKey) {
      return sendError(res, 400, {
        message: messages.voter.pollingStationSecretKeyMissing,
      });
    }

    const { success, message } = await voterLoginService(
      votersKey,
      pollingStationKey
    );

    if (!success) {
      return sendError(res, 400, { message: messages.voter.invalidKeys });
    } else {
      return sendSuccess(res, 200, { message: message });
    }
  } catch (error) {
    console.error("Detailed login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
