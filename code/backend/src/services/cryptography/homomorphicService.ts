import { ElectionResultType } from "../../common/types/electionResultType";
import { loadPaillierKeysFromEnv } from "../../utils/loadPaillierKeys";

export const homomorphicEncryption = (
  currentEncryptedResults: ElectionResultType[],
  candidateId: number
): ElectionResultType[] => {
  try {
    const { publicKey } = loadPaillierKeysFromEnv();

    currentEncryptedResults.forEach((entry) => {
      if (entry.voteCount === 0n) {
        entry.voteCount = publicKey.encrypt(0n);
      }

      if (Number(entry.candidateId) === Number(candidateId)) {
        const plusOne = publicKey.encrypt(1n);
        entry.voteCount = publicKey.addition(entry.voteCount, plusOne);
      }
    });

    return currentEncryptedResults;
  } catch (error) {
    console.error("Homomorphic encryption error:", error);
    throw new Error("Homomorphic encryption failed");
  }
};

export const homomorphicDecryption = (
  currentEncryptedResults: ElectionResultType[]
) => {
  try {
    const { privateKey } = loadPaillierKeysFromEnv();

    const decryptedResults: ElectionResultType[] = currentEncryptedResults.map(
      (entry) => ({
        candidateId: entry.candidateId,
        voteCount: privateKey.decrypt(BigInt(entry.voteCount)),
      })
    );
    return decryptedResults;
  } catch (error) {
    console.error("Error when decrypting: ", error);
    throw new Error("Unexprected error occured when decrypting");
  }
};
