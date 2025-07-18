import { Request, Response } from "express";
import { CandidateType } from "../../common/types/adminTypes";
import { getAllCandidates } from "../../services/admin/adminCandidateService";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import { blockchainHistoryResponseType } from "../../common/types/blockchainResponseTypes";
import { blockchainFetchByKey } from "../../services/blockchain/blockchainServices";

export const getCandidatesForVotingController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidates: CandidateType[] = await getAllCandidates();
    sendSuccess(res, 200, {
      data: candidates,
      message: messages.common.success,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    sendError(res, 500, { message: messages.common.internalServerError });
  }
};

export const voteCountController = async (req: Request, res: Response) => {
  const response: blockchainHistoryResponseType = await blockchainFetchByKey(
    "encrypted_results",
    true
  );
  const count = response.result?.length || 0;
  sendSuccess(res, 200, {
    message: messages.common.success,
    data: { count: count },
  });
};
