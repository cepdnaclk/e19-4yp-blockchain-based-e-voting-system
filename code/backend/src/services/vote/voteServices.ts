import { blockchainHistoryResponseType } from "../../common/types/blockchainResponseTypes";
import { voteRecordType } from "../../common/types/voteRecordTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const fetchVotingHistory = async (): Promise<voteRecordType[]> => {
  const blockchainResponse: blockchainHistoryResponseType =
    await blockchainFetchByKey("vote_history", true);

  const results = blockchainResponse.result || [];

  if (results.length > 0) {
    return results.map((result) => {
      const value = JSON.parse(result.value);
      return {
        voterSecretKeyHash: value.voterSecretKeyHash,
        hasVoted: value.hasVoted,
        candidateId: value.candidateId || null,
        electionId: value.electionId || null,
        partyId: value.partyId || null,
        votedAt: value.votedAt ? new Date(value.votedAt) : null,
      } as voteRecordType;
    });
  } else {
    return [];
  }
};

export const hasVoterVoted = async (
  voterSecretKeyHash: string
): Promise<boolean> => {
  const votingHistory: voteRecordType[] = await fetchVotingHistory();
  const voterRecord = votingHistory.find(
    (record) =>
      record.voterSecretKeyHash === voterSecretKeyHash && record.hasVoted
  );
  return !!voterRecord;
};

export const castVoteWithBlockchian = async (
  voteRecord: voteRecordType
): Promise<string> => {
  try {
    const voteData = JSON.stringify(voteRecord);
    const response = await blockchainPostPut(
      new Map([["vote_history", voteData]]),
      false
    );
    return voteData;
  } catch (error) {
    console.error("Error occured while casiting the vote", error);
    throw new Error("Failed to cast vote");
  }
};
