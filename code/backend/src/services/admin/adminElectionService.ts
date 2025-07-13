import { ElectionType } from "../../common/types/adminTypes";
import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const createNewElection = async (
  name: string,
  startDateTime: Date,
  endDateTime: Date
) => {
  const election: ElectionType = {
    name: name,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    createdAt: new Date(),
  };
  const response: blockchainResponseType = await blockchainPostPut(
    new Map([["election", JSON.stringify(election)]]),
    false
  );

  return election;
};

export const getAllElections = async (): Promise<ElectionType[]> => {
  const results: blockchainResponseType = await blockchainFetchByKey(
    "election",
    true
  );

  const elections = results.result || [];

  if (elections.length === 0) {
    return [];
  } else {
    return elections.map((result) => {
      const value = JSON.parse(result.value);
      return {
        name: value.name,
        startDateTime: new Date(value.startDateTime),
        endDateTime: new Date(value.endDateTime),
        createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
        updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
      };
    });
  }
};
