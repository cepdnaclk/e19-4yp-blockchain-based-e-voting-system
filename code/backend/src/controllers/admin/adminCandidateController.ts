import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import messages from "../../common/constants/messages";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByElection,
  getCandidatesByParty,
  getCandidateByEmail,
  getCandidateByMobile,
  getCandidateByVoteNumber,
  updateCandidate,
  deleteCandidate,
  getCandidatesWithStats,
} from "../../services/admin/adminCandidateService";

export const createCandidateController = async (req: Request, res: Response) => {
  const {
    name,
    birthday,
    address,
    mobileNumber,
    email,
    photo,
    partyId,
    voteNumber,
    electionId,
  }: {
    name: string;
    birthday: Date;
    address: string;
    mobileNumber: string;
    email: string;
    photo?: string;
    partyId?: number;
    voteNumber: string;
    electionId?: number;
  } = req.body;

  if (!name || !birthday || !address || !mobileNumber || !email || !voteNumber) {
    sendError(res, 400, {
      message: "Name, birthday, address, mobile number, email, and vote number are required",
    });
    return;
  }

  try {
    // Check if candidate with same email already exists
    const existingCandidateByEmail = await getCandidateByEmail(email);
    if (existingCandidateByEmail) {
      sendError(res, 409, {
        message: "Candidate with this email already exists",
      });
      return;
    }

    // Check if candidate with same mobile number already exists
    const existingCandidateByMobile = await getCandidateByMobile(mobileNumber);
    if (existingCandidateByMobile) {
      sendError(res, 409, {
        message: "Candidate with this mobile number already exists",
      });
      return;
    }

    // Check if candidate with same vote number in the same election already exists
    const existingCandidateByVoteNumber = await getCandidateByVoteNumber(voteNumber, electionId);
    if (existingCandidateByVoteNumber) {
      sendError(res, 409, {
        message: "Candidate with this vote number already exists in this election",
      });
      return;
    }

    const candidate = await createCandidate({
      name,
      birthday: new Date(birthday),
      address,
      mobileNumber,
      email,
      photo,
      partyId,
      voteNumber,
      electionId,
    });

    sendSuccess(res, 201, {
      message: "Candidate created successfully",
      data: candidate,
    });
  } catch (error) {
    console.error("Error creating candidate:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getAllCandidatesController = async (req: Request, res: Response) => {
  try {
    const candidates = await getAllCandidates();
    sendSuccess(res, 200, {
      message: "Candidates retrieved successfully",
      data: candidates,
    });
  } catch (error) {
    console.error("Error retrieving candidates:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getCandidateByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid candidate ID is required",
    });
    return;
  }

  try {
    const candidate = await getCandidateById(Number(id));
    if (!candidate) {
      sendError(res, 404, {
        message: "Candidate not found",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Candidate retrieved successfully",
      data: candidate,
    });
  } catch (error) {
    console.error("Error retrieving candidate:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getCandidatesByElectionController = async (req: Request, res: Response) => {
  const { electionId } = req.params;

  if (!electionId || isNaN(Number(electionId))) {
    sendError(res, 400, {
      message: "Valid election ID is required",
    });
    return;
  }

  try {
    const candidates = await getCandidatesByElection(Number(electionId));
    sendSuccess(res, 200, {
      message: "Candidates for election retrieved successfully",
      data: candidates,
    });
  } catch (error) {
    console.error("Error retrieving candidates by election:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getCandidatesByPartyController = async (req: Request, res: Response) => {
  const { partyId } = req.params;

  if (!partyId || isNaN(Number(partyId))) {
    sendError(res, 400, {
      message: "Valid party ID is required",
    });
    return;
  }

  try {
    const candidates = await getCandidatesByParty(Number(partyId));
    sendSuccess(res, 200, {
      message: "Candidates for party retrieved successfully",
      data: candidates,
    });
  } catch (error) {
    console.error("Error retrieving candidates by party:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const updateCandidateController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    birthday,
    address,
    mobileNumber,
    email,
    photo,
    partyId,
    voteNumber,
    electionId,
    status,
  }: {
    name?: string;
    birthday?: Date;
    address?: string;
    mobileNumber?: string;
    email?: string;
    photo?: string;
    partyId?: number;
    voteNumber?: string;
    electionId?: number;
    status?: string;
  } = req.body;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid candidate ID is required",
    });
    return;
  }

  try {
    // Check if candidate exists
    const existingCandidate = await getCandidateById(Number(id));
    if (!existingCandidate) {
      sendError(res, 404, {
        message: "Candidate not found",
      });
      return;
    }

    // If email is being updated, check for duplicates
    if (email && email !== existingCandidate.email) {
      const duplicateCandidate = await getCandidateByEmail(email);
      if (duplicateCandidate) {
        sendError(res, 409, {
          message: "Candidate with this email already exists",
        });
        return;
      }
    }

    // If mobile number is being updated, check for duplicates
    if (mobileNumber && mobileNumber !== existingCandidate.mobile_number) {
      const duplicateCandidate = await getCandidateByMobile(mobileNumber);
      if (duplicateCandidate) {
        sendError(res, 409, {
          message: "Candidate with this mobile number already exists",
        });
        return;
      }
    }

    // If vote number is being updated, check for duplicates
    if (voteNumber && voteNumber !== existingCandidate.vote_number) {
      const duplicateCandidate = await getCandidateByVoteNumber(voteNumber, electionId || existingCandidate.election_id);
      if (duplicateCandidate) {
        sendError(res, 409, {
          message: "Candidate with this vote number already exists in this election",
        });
        return;
      }
    }

    const updatedCandidate = await updateCandidate(Number(id), {
      name,
      birthday: birthday ? new Date(birthday) : undefined,
      address,
      mobileNumber,
      email,
      photo,
      partyId,
      voteNumber,
      electionId,
      status: status as 'active' | 'inactive',
    });

    if (!updatedCandidate) {
      sendError(res, 500, {
        message: "Failed to update candidate",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Candidate updated successfully",
      data: updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const deleteCandidateController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    sendError(res, 400, {
      message: "Valid candidate ID is required",
    });
    return;
  }

  try {
    // Check if candidate exists
    const existingCandidate = await getCandidateById(Number(id));
    if (!existingCandidate) {
      sendError(res, 404, {
        message: "Candidate not found",
      });
      return;
    }

    const deleted = await deleteCandidate(Number(id));
    if (!deleted) {
      sendError(res, 500, {
        message: "Failed to delete candidate",
      });
      return;
    }

    sendSuccess(res, 200, {
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
};

export const getCandidatesWithStatsController = async (req: Request, res: Response) => {
  try {
    const candidates = await getCandidatesWithStats();
    sendSuccess(res, 200, {
      message: "Candidates with statistics retrieved successfully",
      data: candidates,
    });
  } catch (error) {
    console.error("Error retrieving candidates with stats:", error);
    sendError(res, 500, {
      message: messages.common.error,
    });
  }
}; 