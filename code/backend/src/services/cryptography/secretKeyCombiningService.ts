import { split, combine } from "shamir-secret-sharing";
import { randomStringGenerator } from "./randomStringGenerator";
import { stringToUint8Array, uint8ArrayToString } from "./uint8StringConverter";

export const secretKeyCombiningService = async (
  votersKey: Uint8Array,
  Uint8Array: Uint8Array
): Promise<string> => {
  const reconstructed = await combine([Uint8Array, Uint8Array]);
  return uint8ArrayToString(reconstructed);
};
