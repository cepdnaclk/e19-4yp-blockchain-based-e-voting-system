import { split } from "shamir-secret-sharing";
import { generateHash, validateHash } from "../auth/authService";
import { blockchainPostPut } from "../blockchain/blockchainServices";
import { fetchAllHashedVoterAccessKeys } from "../voter/voterCommonServices";
import { randomStringGenerator } from "./randomStringGenerator";
import { stringToUint8Array, uint8ArrayToString } from "./uint8StringConverter";

export const secretKeyGenerationService = async (
  keysNumber: number,
  threshold: number
): Promise<{ votersKeyString: string; pollingStationKeyString: string }> => {
  const lengthOfRandomString = process.env.RANDOM_STRING_LENGTH
    ? parseInt(process.env.RANDOM_STRING_LENGTH)
    : 128;

  try {
    let randomString;
    const userAccessKeyHashes = await fetchAllHashedVoterAccessKeys();
    while (true) {
      randomString = randomStringGenerator(lengthOfRandomString);
      let isDuplicate = false;
      for (const entry of userAccessKeyHashes) {
        if (await validateHash(randomString, entry)) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) break;
    }

    const randomStringHash = await generateHash(randomString);
    await blockchainPostPut(
      new Map([
        [
          "userAccessKeyHash",
          JSON.stringify({
            hash: randomStringHash,
            hasVoted: false,
            votedAt: "",
          }),
        ],
      ]),
      false
    );

    const uint8ArrayEncoded = stringToUint8Array(randomString);

    const keys = await split(uint8ArrayEncoded, keysNumber, threshold);

    const votersUint8Array = keys[0];
    const pollingStationUint8Array = keys[1];

    const votersKeyString = uint8ArrayToString(votersUint8Array);
    const pollingStationKeyString = uint8ArrayToString(
      pollingStationUint8Array
    );

    return { votersKeyString, pollingStationKeyString };
  } catch (error) {
    console.error("Error when generating voters keys");
    throw new Error("Voters key generation failed");
  }
};
