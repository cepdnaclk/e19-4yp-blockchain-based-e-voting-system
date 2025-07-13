import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { CandidateType } from "../../common/types/adminTypes";
import {
  createCandidate,
  getAllCandidates,
} from "../../services/admin/adminCandidateService";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const createCandidateController = async (
  req: Request,
  res: Response
) => {
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
  if (
    !name ||
    !birthday ||
    !address ||
    !mobileNumber ||
    !email ||
    !voteNumber
  ) {
    sendError(res, 400, {
      message:
        "Name, birthday, address, mobile number, email, and vote number are required",
    });
    return;
  }

  try {
    const candidates: CandidateType[] = await getAllCandidates();

    // Check if candidate with same email already exists
    const existingCandidateByEmail = candidates.find(
      (entry) => entry.email === email
    );
    if (existingCandidateByEmail) {
      sendError(res, 409, {
        message: "Candidate with this email already exists",
      });
      return;
    }

    // Check if candidate with same mobile number already exists
    const existingCandidateByMobile = candidates.find(
      (entry) => entry.mobileNumber === mobileNumber
    );
    if (existingCandidateByMobile) {
      sendError(res, 409, {
        message: "Candidate with this mobile number already exists",
      });
      return;
    }

    // Check if candidate with same vote number in the same election already exists
    const existingCandidateByVoteNumber = candidates.find(
      (entry) => entry.voteNumber === voteNumber
    );
    if (existingCandidateByVoteNumber) {
      sendError(res, 409, {
        message:
          "Candidate with this vote number already exists in this election",
      });
      return;
    }

    const candidate = await createCandidate({
      name,
      birthday: new Date(birthday.toString().split("T")[0]),
      address,
      mobileNumber,
      email,
      photo,
      partyId,
      voteNumber,
      electionId,
      status: electionId ? "active" : "inactive",
      createdAt: new Date(),
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

export const getAllCandidatesController = async (
  req: Request,
  res: Response
) => {
  try {
    const candidates: CandidateType[] = await getAllCandidates();
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
