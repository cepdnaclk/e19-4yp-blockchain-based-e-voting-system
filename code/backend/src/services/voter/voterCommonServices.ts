import { voterTypes } from "../../common/types/voterTypes";
import { blockchainFetchByKey } from "../blockchain/blockchainServices";

export const fetchAllHashhedVoterRecords = async (): Promise<voterTypes[]> => {
  const userAccessKeyHashHistory = await blockchainFetchByKey(
    "userAccessKeyHash",
    true
  );
  const currentUserAccessKeys = userAccessKeyHashHistory.result
    ? userAccessKeyHashHistory.result
    : [];

  const hashedVoterRecords = currentUserAccessKeys.map((result) => {
    const value = JSON.parse(result.value);
    return {
      hash: value.hash,
      hasVoted: value.hasVoted,
      votedAt: value.votedAt ? new Date(value.votedAt) : null,
    };
  });

  return hashedVoterRecords;
};

export const fetchAllHashedVoterAccessKeys = async (): Promise<string[]> => {
  const hashedVoterRecords = await fetchAllHashhedVoterRecords();
  const userAccessKeyHashes = hashedVoterRecords.map((record) => record.hash);
  return userAccessKeyHashes;
};
