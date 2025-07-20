import { blockchainHistoryResponseType } from "../../common/types/blockchainResponseTypes";
import { generateHash } from "../auth/authService";
import { blockchainPostPut } from "../blockchain/blockchainServices";
import { dbQuery } from "../common/dbService";

export const adminRegisterService = async (
  username: string,
  password: string
): Promise<blockchainHistoryResponseType> => {
  const hashedPassword = await generateHash(password);
  try {
    const query =
      "INSERT INTO admin_data (user_name, password, created_at) VALUES ($1, $2, $3)";
    const params = [username, hashedPassword, new Date()];
    await dbQuery({ query: query, params: params });
  } catch (error) {
    console.error("Error when registring the admin", error);
  }
  const response: blockchainHistoryResponseType = await blockchainPostPut(
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
