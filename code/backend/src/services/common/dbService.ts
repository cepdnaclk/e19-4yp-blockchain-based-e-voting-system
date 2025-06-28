import { queryDatabase } from "../../models/db";

export const dbQuery = async ({
  query,
  params,
}: {
  query: string;
  params: any[];
}): Promise<any> => {
  return await queryDatabase(query, params);
};
