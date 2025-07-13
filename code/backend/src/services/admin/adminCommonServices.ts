import { AdminUserType } from "../../common/types/adminTypes";
import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import { blockchainFetchByKey } from "../blockchain/blockchainServices";

export const getAdminUsersByUsername = async (
  username: string
): Promise<AdminUserType | null> => {
  const response: blockchainResponseType = await blockchainFetchByKey(
    "admin",
    true
  );
  console.log(response);
  const results: AdminUserType[] = response.result
    ? response.result.map((item) => {
        const value = JSON.parse(item.value);
        return {
          username: value.username,
          hashedPassword: value.hashedPassword,
          createdAt: item.timestamp,
        };
      })
    : [];

  console.log(
    results.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    )
  );

  return (
    results.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    ) || null
  );
};
