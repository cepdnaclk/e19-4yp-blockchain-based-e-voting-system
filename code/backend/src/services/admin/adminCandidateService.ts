import { CandidateType } from "../../common/types/adminTypes";
import {
  blockchainHistoryResponseType,
  blockchainRecordResponseType,
} from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const createCandidate = async (
  candidateData: CandidateType
): Promise<CandidateType> => {
  const existingCandidate: CandidateType | null = await getLastCandidate();
  let candidateId = 1;
  if (existingCandidate) {
    candidateId = (Number(existingCandidate.id) || 0) + 1;
  }
  const candidate: CandidateType = {
    id: candidateId,
    name: candidateData.name,
    birthday: candidateData.birthday,
    address: candidateData.address,
    mobileNumber: candidateData.mobileNumber,
    email: candidateData.email,
    voteNumber: candidateData.voteNumber,
    photo: candidateData.photo ? candidateData.photo : undefined,
    partyId: candidateData.partyId ? candidateData.partyId : undefined,
    electionId: candidateData.electionId ? candidateData.electionId : undefined,
    status: candidateData.status,
    createdAt: candidateData.createdAt || new Date(),
  };
  await blockchainPostPut(
    new Map([["candidate", JSON.stringify(candidate)]]),
    false
  );

  return candidate;
};

export const getLastCandidate = async (): Promise<CandidateType | null> => {
  const candidateHistory: blockchainRecordResponseType =
    await blockchainFetchByKey("candidate");

  if (candidateHistory.result && candidateHistory.result.value) {
    const value = JSON.parse(candidateHistory.result.value);
    return {
      id: value.id,
      name: value.name,
      birthday: new Date(value.birthday),
      address: value.address,
      mobileNumber: value.mobileNumber,
      email: value.email,
      photo: value.photo || null,
      partyId: value.partyId || null,
      voteNumber: value.voteNumber,
      electionId: value.electionId || null,
      status: value.status,
      createdAt: new Date(value.createdAt),
      updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
    };
  } else {
    return null;
  }
};

export const getAllCandidates = async (): Promise<CandidateType[]> => {
  const candidateHistory: blockchainHistoryResponseType =
    await blockchainFetchByKey("candidate", true);

  const results = candidateHistory.result || [];

  if (results.length === 0) {
    return [];
  } else {
    const candidates = results.map((result) => {
      const value = JSON.parse(result.value);
      return {
        id: value.id,
        name: value.name,
        birthday: new Date(value.birthday),
        address: value.address,
        mobileNumber: value.mobileNumber,
        email: value.email,
        photo: value.photo || null,
        partyId: value.partyId || null,
        voteNumber: value.voteNumber,
        electionId: value.electionId || null,
        status: value.status,
        createdAt: new Date(value.createdAt),
        updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
      };
    });
    return candidates;
  }
};
