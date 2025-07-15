import { ElectionType } from "../../common/types/adminTypes";
import {
  blockchainHistoryResponseType,
  blockchainRecordResponseType,
} from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const createNewElection = async (
  name: string,
  startDateTime: Date,
  endDateTime: Date
) => {
  const existingElection: ElectionType | null = await getLastElection();
  let electionId = 1;
  if (existingElection) {
    electionId = existingElection.id ? existingElection.id + 1 : 1;
  }

  const election: ElectionType = {
    id: electionId,
    name: name,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    createdAt: new Date(),
  };
  await blockchainPostPut(
    new Map([["election", JSON.stringify(election)]]),
    false
  );

  return election;
};

export const getLastElection = async (): Promise<ElectionType | null> => {
  const election: blockchainRecordResponseType = await blockchainFetchByKey(
    "election",
    false
  );
  if (election.result && election.result.value) {
    const value = JSON.parse(election.result.value);
    return {
      id: value.id,
      name: value.name,
      startDateTime: new Date(value.startDateTime),
      endDateTime: new Date(value.endDateTime),
      createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
      updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
    };
  } else {
    return null;
  }
};

export const getAllElections = async (): Promise<ElectionType[]> => {
  const results: blockchainHistoryResponseType = await blockchainFetchByKey(
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
