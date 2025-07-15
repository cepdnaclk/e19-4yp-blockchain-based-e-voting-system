import { PartyType } from "../../common/types/adminTypes";
import {
  blockchainHistoryResponseType,
  blockchainRecordResponseType,
} from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const createParty = async (partyData: PartyType): Promise<PartyType> => {
  const existingParty: PartyType | null = await getLastParty();
  let partyId = 1;
  if (existingParty) {
    partyId = existingParty.id ? existingParty.id + 1 : 1;
  }
  const party: PartyType = {
    id: partyId,
    name: partyData.name,
    symbol: partyData.symbol,
    status: partyData.status || "active",
    createdAt: partyData.createdAt || new Date(),
  };
  const response: blockchainHistoryResponseType = await blockchainPostPut(
    new Map([["party", JSON.stringify(party)]]),
    false
  );

  return party;
};

export const getLastParty = async (): Promise<PartyType | null> => {
  const partyHistory: blockchainRecordResponseType = await blockchainFetchByKey(
    "party"
  );

  if (partyHistory.result && partyHistory.result.value) {
    const value = JSON.parse(partyHistory.result.value);
    return {
      id: value.id,
      name: value.name,
      symbol: value.symbol,
      status: value.status || "inactive",
      createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
      updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
    };
  } else {
    return null;
  }
};

export const getAllParties = async (): Promise<PartyType[]> => {
  const partyHistory = await blockchainFetchByKey("party", true);

  const results = partyHistory.result || [];

  if (results.length === 0) {
    return [];
  } else {
    const parties: PartyType[] = results.map((result) => {
      const value = JSON.parse(result.value);
      return {
        name: value.name,
        symbol: value.symbol,
        status: value.status,
        createdAt: value.create ? new Date(value.create) : undefined,
        updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
      };
    });
    return parties;
  }
};
