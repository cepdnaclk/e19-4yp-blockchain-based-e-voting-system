import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { PartyType } from "../../common/types/adminTypes";
import {
  createParty,
  getAllParties,
} from "../../services/admin/adminPartyService";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const createPartyController = async (req: Request, res: Response) => {
  const {
    name,
    symbol,
    electionId,
  }: { name: string; symbol: string; electionId: string } = req.body;

  if (!name || !symbol) {
    sendError(res, 400, {
      message:
        "The following fields are missing:" + name
          ? " Party name, "
          : "" + symbol
          ? " Party symbol, "
          : "",
    });
    return;
  }

  if (!electionId) {
    sendError(res, 400, {
      message: "A party must have an eleciton assocaiated to it",
    });
    return;
  }

  try {
    const party = await createParty({ name, symbol, electionId });
    sendSuccess(res, 201, {
      message: "Party created successfully",
      data: party,
    });
  } catch (error) {
    console.error("Error creating party:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getAllPartiesController = async (req: Request, res: Response) => {
  try {
    const parties = await getAllParties();
    sendSuccess(res, 200, {
      message: "Parties retrieved successfully",
      data: parties,
    });
  } catch (error) {
    console.error("Error retrieving parties:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};
