import bcrypt from "bcrypt";
import { dbQuery } from "./dbService";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validateUserName = async (username: string): Promise<boolean> => {
  const currentUsernames: { user_name: string }[] = (
    await dbQuery({ query: "SELECT user_name FROM admin_data", params: [] })
  ).rows;
  const isDuplicate: boolean = currentUsernames.some(
    (name) => name.user_name === username
  );

  return isDuplicate;
};
