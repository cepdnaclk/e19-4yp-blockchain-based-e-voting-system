import dotenv from "dotenv";

dotenv.config();

const db = require("../models/db");

export const dbQuery = async ({
  query,
  params,
}: {
  query: string;
  params: any[];
}): Promise<any> => {
  const response = await db.query(query, params);
  return response;
};
