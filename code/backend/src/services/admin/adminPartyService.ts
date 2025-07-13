import { PartyType } from "../../common/types/adminTypes";
import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";

export const createParty = async (partyData: PartyType): Promise<PartyType> => {
  const party: PartyType = {
    name: partyData.name,
    symbol: partyData.symbol,
    status: partyData.status || "active",
    createdAt: partyData.createdAt || new Date(),
  };
  const response: blockchainResponseType = await blockchainPostPut(
    new Map([["party", JSON.stringify(party)]]),
    false
  );

  return party;
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
