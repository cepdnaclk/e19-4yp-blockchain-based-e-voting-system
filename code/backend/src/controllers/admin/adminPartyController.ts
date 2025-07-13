import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { PartyType } from "../../common/types/adminTypes";
import {
  createParty,
  getAllParties,
} from "../../services/admin/adminPartyService";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const createPartyController = async (req: Request, res: Response) => {
  const { name, symbol }: { name: string; symbol: string } = req.body;

  if (!name || !symbol) {
    sendError(res, 400, {
      message: "Party name and symbol are required",
    });
    return;
  }

  try {
    // Check if party with same name already exists
    const parties: PartyType[] = await getAllParties();
    const existingParty = parties.find((party) => party.name === name);
    if (existingParty) {
      sendError(res, 409, {
        message: "Party with this name already exists",
      });
      return;
    }

    const party = await createParty({ name, symbol });
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
