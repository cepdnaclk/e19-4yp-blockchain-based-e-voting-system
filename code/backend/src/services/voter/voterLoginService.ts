import { validateHash } from "../auth/authService";
import { secretKeyCombiningService } from "../cryptography/secretKeyCombiningService";
import { fetchAllHashedVoterAccessKeys } from "./voterCommonServices";

export const voterLoginService = async (
  votersSecretKey: string,
  pollingStationSecretKey: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const reconstructedSecretKey = await secretKeyCombiningService(
      votersSecretKey,
      pollingStationSecretKey
    );
    const hashedSecretKeys = await fetchAllHashedVoterAccessKeys();
    for (const entry of hashedSecretKeys) {
      if (await validateHash(reconstructedSecretKey, entry.hash)) {
        return { success: true, message: entry.hash };
      }
    }

    return { success: false, message: "Invalid secret keys" };
  } catch (error) {
    console.error("Error during voter login:", error);
    return { success: false, message: "Invalid secret key" };
  }
};
