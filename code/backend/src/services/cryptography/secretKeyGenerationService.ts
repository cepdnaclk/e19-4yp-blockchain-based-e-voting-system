import { split } from "shamir-secret-sharing";
import { randomStringGenerator } from "./randomStringGenerator";
import { stringToUint8Array } from "./uint8StringConverter";

export const secretKeyGenerationService = async (
  keysNumber: number,
  threshold: number
): Promise<Uint8Array[]> => {
  const lengthOfRandomString = process.env.RANDOM_STRING_LENGTH
    ? parseInt(process.env.RANDOM_STRING_LENGTH)
    : 128;
  const randomString = randomStringGenerator(lengthOfRandomString);
  const uint8ArrayEncoded = stringToUint8Array(randomString);

  return await split(uint8ArrayEncoded, keysNumber, threshold);
};
