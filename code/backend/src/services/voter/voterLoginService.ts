import { validateHash } from "../auth/authService";
import { secretKeyCombiningService } from "../cryptography/secretKeyCombiningService";
import { fetchAllHashedVoterAccessKeys } from "./voterCommonServices";

export const voterLoginService = async (
  votersSecretKey: string,
  pollingStationSecretKey: string
): Promise<{ success: boolean; message: string }> => {
  const reconstructedSecretKey = await secretKeyCombiningService(
    votersSecretKey,
    pollingStationSecretKey
  );
  const hashedSecretKeys = await fetchAllHashedVoterAccessKeys();

  for (const hash of hashedSecretKeys) {
    if (await validateHash(reconstructedSecretKey, hash)) {
      return { success: true, message: "Login successful" };
    }
  }

  return { success: false, message: "Invalid secret key" };
};
