import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import { resultTallyService } from "../../services/results/resultTallyService";
import { ElectionResultType } from "../../common/types/electionResultType";

export const resultTallyController = async (req: Request, res: Response) => {
  try {
    const results: ElectionResultType[] = await resultTallyService();
    const resultsFormatted: { candidateId: string; voteCount: string }[] =
      results.map((entry) => ({
        candidateId: entry.candidateId.toString(),
        voteCount: entry.voteCount.toString(),
      }));
    sendSuccess(res, 200, {
      message: messages.results.resultTallyingSuccessfull,
      data: resultsFormatted,
    });
  } catch (error) {
    console.error("Error when result tallying", error);
    sendError(res, 500, { message: messages.common.internalServerError });
  }
};
