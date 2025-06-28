import { AdminUserType } from "../../common/types/adminTypes";
import { dbQuery } from "../common/dbService";

export const getAdminUsersByUsername = async (
  username: string
): Promise<AdminUserType[]> => {
  const results: AdminUserType[] = (
    await dbQuery({
      query: "SELECT * FROM admin_data WHERE user_name = $1",
      params: [username],
    })
  ).rows;
  return results;
};
