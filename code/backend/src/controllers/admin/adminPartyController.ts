import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import {
  createParty,
  getAllParties,
  getPartyById,
  getPartyByName,
  updateParty,
  deleteParty,
  getPartiesWithCandidateCount,
} from "../../services/admin/adminPartyService";

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
    const existingParty = await getPartyByName(name);
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

export const getPartyByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid party ID is required",
    });
    return;
  }

  try {
    const party = await getPartyById(Number(id));
    if (!party) {
      sendError(res, 404, {
        message: "Party not found",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Party retrieved successfully",
      data: party,
    });
  } catch (error) {
    console.error("Error retrieving party:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const updatePartyController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    symbol,
    status,
  }: { name?: string; symbol?: string; status?: string } = req.body;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid party ID is required",
    });
    return;
  }

  if (!name && !symbol && !status) {
    sendError(res, 400, {
      message:
        "At least one field (name, symbol, or status) is required for update",
    });
    return;
  }

  try {
    // Check if party exists
    const existingParty = await getPartyById(Number(id));
    if (!existingParty) {
      sendError(res, 404, {
        message: "Party not found",
      });
      return;
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingParty.name) {
      const duplicateParty = await getPartyByName(name);
      if (duplicateParty) {
        sendError(res, 409, {
          message: "Party with this name already exists",
        });
        return;
      }
    }

    const updatedParty = await updateParty(Number(id), {
      name,
      symbol,
      status: status as "active" | "inactive",
    });
    if (!updatedParty) {
      sendError(res, 500, {
        message: "Failed to update party",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Party updated successfully",
      data: updatedParty,
    });
  } catch (error) {
    console.error("Error updating party:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const deletePartyController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid party ID is required",
    });
    return;
  }

  try {
    // Check if party exists
    const existingParty = await getPartyById(Number(id));
    if (!existingParty) {
      sendError(res, 404, {
        message: "Party not found",
      });
      return;
    }

    const deleted = await deleteParty(Number(id));
    if (!deleted) {
      sendError(res, 500, {
        message: "Failed to delete party",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Party deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting party:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getPartiesWithStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const parties = await getPartiesWithCandidateCount();
    sendSuccess(res, 200, {
      message: "Parties with statistics retrieved successfully",
      data: parties,
    });
  } catch (error) {
    console.error("Error retrieving parties with stats:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};
