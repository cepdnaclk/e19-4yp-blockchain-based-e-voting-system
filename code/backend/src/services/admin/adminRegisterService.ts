import { hashPassword } from "../auth/authService";
import { blockchainPostPut } from "../blockchain/blockchainServices";

export const adminRegisterService = async (
  username: string,
  password: string
): Promise<{ id: number }> => {
  const hashedPassword = await hashPassword(password);
  const response = await blockchainPostPut(
    new Map([
      [
        "admin",
        JSON.stringify({ username: "admin", hashedPassword: hashedPassword }),
      ],
    ]),
    false
  );

  console.log(response);

  return { id: 0 };
};
