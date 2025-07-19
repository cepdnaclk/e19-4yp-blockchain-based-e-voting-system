import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import { secretKeyGenerationService } from "../../services/cryptography/secretKeyGenerationService";

export const voterRegistrationController = async (
  req: Request,
  res: Response
) => {
  const isRegistrationAllowed: boolean =
    process.env.VOTER_REGISTRATION_ALLOWED === "true";

  if (!isRegistrationAllowed) {
    console.error(
      "Voter registration and key generation is not allowed at this time."
    );
    sendError(res, 403, {
      message: messages.voter.registrationIsNotAllowed,
    });
    return;
  }

  try {
    const { votersKeyString, pollingStationKeyString } =
      await secretKeyGenerationService(2, 2);
    const responseData = {
      votersKey: votersKeyString,
      pollingStationKey: pollingStationKeyString,
    };
    sendSuccess(res, 201, {
      data: responseData,
      message: messages.voter.registrationSuccess,
    });
  } catch (error) {
    console.error("Error during voter registration:", error);
    sendError(res, 500, {
      message: messages.common.error,
      error: error,
    });
  }
};
