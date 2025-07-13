import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import {
  createNewElection,
  getAllElections,
} from "../../services/admin/adminElectionService";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { ElectionType } from "../../common/types/adminTypes";

export const createNewElectionController = async (
  req: Request,
  res: Response
) => {
  const {
    name,
    startDateTime,
    endDateTime,
  }: { name: string; startDateTime: Date; endDateTime: Date } = req.body;

  if (!name || !startDateTime || !endDateTime) {
    sendError(res, 400, {
      message:
        messages.election.missingFields + !name
          ? "name"
          : "" + !startDateTime
          ? "startDateTime"
          : "" + !endDateTime
          ? "endDateTime"
          : "",
    });
    return;
  }

  if (startDateTime >= endDateTime) {
    sendError(res, 400, {
      message: messages.election.startDateEndDateMismatch,
    });
    return;
  }

  try {
    // Check if election with same name already exists
    const elections = await getAllElections();
    const existingElection = elections.find(
      (election) => election.name === name
    );
    if (existingElection) {
      sendError(res, 409, {
        message: "Election with this name already exists",
      });
      return;
    }

    const response: ElectionType = await createNewElection(
      name,
      startDateTime,
      endDateTime
    );
    if (!response) {
      sendError(res, 500, {
        message: messages.common.error,
      });
      return;
    }
    sendSuccess(res, 201, {
      message: messages.election.createSuccess,
      data: response,
    });
  } catch (error) {
    console.log("Error creating new election:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getAllElectionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const elections = await getAllElections();
    sendSuccess(res, 200, {
      message: "Elections retrieved successfully",
      data: elections,
    });
  } catch (error) {
    console.error("Error retrieving elections:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};
