import { CandidateType, ElectionType } from "../../common/types/adminTypes";
import {
  blockchainHistoryResponseType,
  blockchainRecordResponseType,
} from "../../common/types/blockchainResponseTypes";
import { ElectionResultType } from "../../common/types/electionResultType";
import { getAllElections } from "../admin/adminElectionService";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const getLastElectionEncryptedResult = async (): Promise<
  ElectionResultType[]
> => {
  try {
    const response: blockchainRecordResponseType = await blockchainFetchByKey(
      "encrypted_results",
      false
    );
    const value = response.result?.value;
    if (value) {
      const resultHistory: {
        candidateId: string;
        voteCount: string;
      }[] = JSON.parse(value);
      const formattedHistory: ElectionResultType[] = resultHistory.map(
        (entry) => ({
          candidateId: Number(entry.candidateId),
          voteCount: BigInt(entry.voteCount),
        })
      );
      return formattedHistory;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error converting a string into bigInt: ", error);
    throw new Error("Type conversion failed. String -> BigInt");
  }
};

export const generateCurrentEncryptedResults = async (
  candidates: CandidateType[]
): Promise<ElectionResultType[]> => {
  let currentEncryptedResults: ElectionResultType[] =
    await getLastElectionEncryptedResult();

  if (currentEncryptedResults.length === 0) {
    const activeElection: ElectionType = (await getAllElections()).filter(
      (election) =>
        new Date(election.startDateTime) <= new Date() &&
        new Date(election.endDateTime) >= new Date()
    )[0];

    const activeCandidate: CandidateType[] = candidates.filter(
      (candidate) => Number(candidate.electionId) === Number(activeElection.id)
    );

    currentEncryptedResults = activeCandidate.map((candidate) => ({
      candidateId: Number(candidate.id),
      voteCount: 0n,
    }));
  }

  return currentEncryptedResults;
};

export const storeEncryptedRecordInBlockchian = async (
  encryptedResults: ElectionResultType[]
): Promise<blockchainHistoryResponseType> => {
  try {
    const serializedData = JSON.stringify(
      encryptedResults.map((entry) => ({
        candidateId: entry.candidateId.toString(),
        voteCount: entry.voteCount.toString(),
      }))
    );
    const response = await blockchainPostPut(
      new Map([["encrypted_results", serializedData]]),
      false
    );
    return response;
  } catch (error) {
    console.error("Filed to store encrypted result in blockchain : ", error);
    throw new Error("Failed to store the encrypted result in the blockchian");
  }
};
