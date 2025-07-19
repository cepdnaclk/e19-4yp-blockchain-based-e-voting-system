import { combine } from "shamir-secret-sharing";
import { stringToUint8Array, uint8ArrayToString } from "./uint8StringConverter";

export const secretKeyCombiningService = async (
  votersSecretKey: string,
  pollingStationSecretKey: string
): Promise<string> => {
  const votersSecretKeyUnit8Arry = stringToUint8Array(votersSecretKey);
  const pollingStationSecretKeyUnit8Array = stringToUint8Array(
    pollingStationSecretKey
  );
  const reconstructed = await combine([
    votersSecretKeyUnit8Arry,
    pollingStationSecretKeyUnit8Array,
  ]);
  return uint8ArrayToString(reconstructed);
};
