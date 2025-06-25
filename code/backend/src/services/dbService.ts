export const dbQuery = async ({
  query,
  params,
}: {
  query: string;
  params: any[];
}): Promise<any> => {
  const db = require("../models/db");
  const response = await db.query(query, params);
  return response;
};
