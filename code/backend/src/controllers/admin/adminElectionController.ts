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
    // Check for overlapping dates
    const elections = await getAllElections();
    let hasOverlap = false;
    for (const election of elections) {
      console.log("Checking election:", election);
      console.log("Start Date:", startDateTime);
      console.log("End date ", endDateTime);
      if (
        (new Date(startDateTime) >= new Date(election.startDateTime) &&
          new Date(startDateTime) <= new Date(election.endDateTime)) ||
        (new Date(endDateTime) >= new Date(election.startDateTime) &&
          new Date(endDateTime) <= new Date(election.endDateTime)) ||
        (new Date(startDateTime) <= new Date(election.startDateTime) &&
          new Date(endDateTime) >= new Date(election.endDateTime))
      ) {
        hasOverlap = true;
        break;
      }
    }

    if (hasOverlap) {
      sendError(res, 409, {
        message: messages.election.hasOverlappingDays,
        data: { startDateTime: startDateTime, endDateTime: endDateTime },
      });
      return;
    }

    // Check if election with same name already exists
    const existingElection = elections.find(
      (election) => election.name === name
    );
    if (existingElection) {
      sendError(res, 409, {
        message: messages.election.duplicateName,
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
