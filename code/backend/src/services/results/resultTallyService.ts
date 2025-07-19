import { ElectionResultType } from "../../common/types/electionResultType";
import { homomorphicDecryption } from "../cryptography/homomorphicService";
import { getLastElectionEncryptedResult } from "./electionResultService";

export const resultTallyService = async () => {
  const results: ElectionResultType[] = await getLastElectionEncryptedResult();
  const decryptedResult: ElectionResultType[] = homomorphicDecryption(results);
  return decryptedResult;
};
