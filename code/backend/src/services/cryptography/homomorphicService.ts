import { ElectionResultType } from "../../common/types/electionResultType";
import { loadPaillierKeysFromEnv } from "../../utils/loadPaillierKeys";

// Applies homomorphic encryption to update encrypted vote counts for candidates
export const homomorphicEncryption = (
  currentEncryptedResults: ElectionResultType[],
  candidateId: number
): ElectionResultType[] => {
  try {
    // Load public key for encryption
    const { publicKey } = loadPaillierKeysFromEnv();

    currentEncryptedResults.forEach((entry) => {
      // Initialize encrypted vote count if not set
      if (entry.voteCount === 0n) {
        entry.voteCount = publicKey.encrypt(0n);
      }

      // If this is the selected candidate, add an encrypted vote
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

// Decrypts the encrypted vote counts for all candidates
export const homomorphicDecryption = (
  currentEncryptedResults: ElectionResultType[]
) => {
  try {
    // Load private key for decryption
    const { privateKey } = loadPaillierKeysFromEnv();

    // Decrypt each candidate's vote count
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
