import { dbQuery } from "../common/dbService";
import {
  ElectionType,
  CreateElectionRequest,
  UpdateElectionRequest,
} from "../../common/types/adminTypes";

export const createNewElection = async (
  name: string,
  startDateTime: Date,
  endDateTime: Date
) => {
  const query =
    "INSERT INTO election (name, start_date_time, end_date_time) VALUES ($1, $2, $3) RETURNING *";
  const params = [name, startDateTime, endDateTime];

  return await dbQuery({
    query: query,
    params: params,
  });
};

export const getAllElections = async (): Promise<ElectionType[]> => {
  const query = `
    SELECT * FROM election 
    ORDER BY start_date_time DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getElectionById = async (
  id: number
): Promise<ElectionType | null> => {
  const query = `
    SELECT * FROM election 
    WHERE id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const getElectionByName = async (
  name: string
): Promise<ElectionType | null> => {
  const query = `
    SELECT * FROM election 
    WHERE name = $1
  `;
  const params = [name];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const updateElection = async (
  id: number,
  electionData: UpdateElectionRequest
): Promise<ElectionType | null> => {
  const updateFields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (electionData.name !== undefined) {
    updateFields.push(`name = $${paramIndex}`);
    params.push(electionData.name);
    paramIndex++;
  }

  if (electionData.startDateTime !== undefined) {
    updateFields.push(`start_date_time = $${paramIndex}`);
    params.push(electionData.startDateTime);
    paramIndex++;
  }

  if (electionData.endDateTime !== undefined) {
    updateFields.push(`end_date_time = $${paramIndex}`);
    params.push(electionData.endDateTime);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    return await getElectionById(id);
  }

  params.push(id);

  const query = `
    UPDATE election 
    SET ${updateFields.join(", ")} 
    WHERE id = $${paramIndex} 
    RETURNING *
  `;

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const deleteElection = async (id: number): Promise<boolean> => {
  const query = `
    DELETE FROM election 
    WHERE id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rowCount > 0;
};

export const getElectionsWithStats = async (): Promise<any[]> => {
  const query = `
    SELECT 
      e.*,
      COUNT(DISTINCT c.id) as candidate_count,
      COUNT(DISTINCT v.id) as vote_count
    FROM election e
    LEFT JOIN candidates c ON e.id = c.election_id AND c.status = 'active'
    LEFT JOIN votes v ON e.id = v.election_id
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getActiveElections = async (): Promise<ElectionType[]> => {
  const query = `
    SELECT * FROM election 
    WHERE start_date_time <= current_timestamp 
    AND end_date_time >= current_timestamp
    ORDER BY start_date_time
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getUpcomingElections = async (): Promise<ElectionType[]> => {
  const query = `
    SELECT * FROM election 
    WHERE start_date_time > current_timestamp
    ORDER BY start_date_time
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getCompletedElections = async (): Promise<ElectionType[]> => {
  const query = `
    SELECT * FROM election 
    WHERE end_date_time < current_timestamp
    ORDER BY end_date_time DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};
