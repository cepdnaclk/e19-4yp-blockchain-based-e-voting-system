import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import { generateHash } from "../auth/authService";
import { blockchainPostPut } from "../blockchain/blockchainServices";

export const adminRegisterService = async (
  username: string,
  password: string
): Promise<blockchainResponseType> => {
  const hashedPassword = await generateHash(password);
  const response: blockchainResponseType = await blockchainPostPut(
    new Map([
      [
        "admin",
        JSON.stringify({
          username: username,
          hashedPassword: hashedPassword.toString(),
        }),
      ],
    ]),
    false
  );

  return response;
};
