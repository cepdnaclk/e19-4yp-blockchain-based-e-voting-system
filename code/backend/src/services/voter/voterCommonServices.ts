import { voterTypes } from "../../common/types/voterTypes";
import { blockchainFetchByKey } from "../blockchain/blockchainServices";

export const fetchAllHashedVoterAccessKeys = async (): Promise<
  voterTypes[]
> => {
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
    };
  });

  return hashedVoterRecords;
};
