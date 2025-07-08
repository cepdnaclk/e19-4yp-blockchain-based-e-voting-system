import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import { 
  createNewElection,
  getAllElections,
  getElectionById,
  getElectionByName,
  updateElection,
  deleteElection,
  getElectionsWithStats,
  getActiveElections,
  getUpcomingElections,
  getCompletedElections,
} from "../../services/admin/adminElectionService";

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
    const existingElection = await getElectionByName(name);
    if (existingElection) {
      sendError(res, 409, {
        message: "Election with this name already exists",
      });
      return;
    }

    const response = (await createNewElection(name, startDateTime, endDateTime))
      .rows[0];
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

export const getAllElectionsController = async (req: Request, res: Response) => {
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

export const getElectionByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid election ID is required",
    });
    return;
  }

  try {
    const election = await getElectionById(Number(id));
    if (!election) {
      sendError(res, 404, {
        message: "Election not found",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Election retrieved successfully",
      data: election,
    });
  } catch (error) {
    console.error("Error retrieving election:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const updateElectionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, startDateTime, endDateTime }: { name?: string; startDateTime?: Date; endDateTime?: Date } = req.body;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid election ID is required",
    });
    return;
  }

  if (!name && !startDateTime && !endDateTime) {
    sendError(res, 400, {
      message: "At least one field (name, startDateTime, or endDateTime) is required for update",
    });
    return;
  }

  try {
    // Check if election exists
    const existingElection = await getElectionById(Number(id));
    if (!existingElection) {
      sendError(res, 404, {
        message: "Election not found",
      });
      return;
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingElection.name) {
      const duplicateElection = await getElectionByName(name);
      if (duplicateElection) {
        sendError(res, 409, {
          message: "Election with this name already exists",
        });
        return;
      }
    }

    // Validate date range if dates are being updated
    const finalStartDateTime = startDateTime || existingElection.start_date_time;
    const finalEndDateTime = endDateTime || existingElection.end_date_time;

    if (finalStartDateTime >= finalEndDateTime) {
      sendError(res, 400, {
        message: messages.election.startDateEndDateMismatch,
      });
      return;
    }

    const updatedElection = await updateElection(Number(id), { name, startDateTime, endDateTime });
    if (!updatedElection) {
      sendError(res, 500, {
        message: "Failed to update election",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Election updated successfully",
      data: updatedElection,
    });
  } catch (error) {
    console.error("Error updating election:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const deleteElectionController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid election ID is required",
    });
    return;
  }

  try {
    // Check if election exists
    const existingElection = await getElectionById(Number(id));
    if (!existingElection) {
      sendError(res, 404, {
        message: "Election not found",
      });
      return;
    }

    const deleted = await deleteElection(Number(id));
    if (!deleted) {
      sendError(res, 500, {
        message: "Failed to delete election",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Election deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting election:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getElectionsWithStatsController = async (req: Request, res: Response) => {
  try {
    const elections = await getElectionsWithStats();
    sendSuccess(res, 200, {
      message: "Elections with statistics retrieved successfully",
      data: elections,
    });
  } catch (error) {
    console.error("Error retrieving elections with stats:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getActiveElectionsController = async (req: Request, res: Response) => {
  try {
    const elections = await getActiveElections();
    sendSuccess(res, 200, {
      message: "Active elections retrieved successfully",
      data: elections,
    });
  } catch (error) {
    console.error("Error retrieving active elections:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getUpcomingElectionsController = async (req: Request, res: Response) => {
  try {
    const elections = await getUpcomingElections();
    sendSuccess(res, 200, {
      message: "Upcoming elections retrieved successfully",
      data: elections,
    });
  } catch (error) {
    console.error("Error retrieving upcoming elections:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getCompletedElectionsController = async (req: Request, res: Response) => {
  try {
    const elections = await getCompletedElections();
    sendSuccess(res, 200, {
      message: "Completed elections retrieved successfully",
      data: elections,
    });
  } catch (error) {
    console.error("Error retrieving completed elections:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};
