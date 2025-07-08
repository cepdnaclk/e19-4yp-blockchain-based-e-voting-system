import { dbQuery } from "../common/dbService";
import { PartyType, CreatePartyRequest, UpdatePartyRequest } from "../../common/types/adminTypes";

export const createParty = async (partyData: CreatePartyRequest): Promise<PartyType> => {
  const query = `
    INSERT INTO parties (name, symbol) 
    VALUES ($1, $2) 
    RETURNING *
  `;
  const params = [partyData.name, partyData.symbol];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0];
};

export const getAllParties = async (): Promise<PartyType[]> => {
  const query = `
    SELECT * FROM parties 
    ORDER BY created_at DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getPartyById = async (id: number): Promise<PartyType | null> => {
  const query = `
    SELECT * FROM parties 
    WHERE id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const getPartyByName = async (name: string): Promise<PartyType | null> => {
  const query = `
    SELECT * FROM parties 
    WHERE name = $1
  `;
  const params = [name];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const updateParty = async (id: number, partyData: UpdatePartyRequest): Promise<PartyType | null> => {
  const updateFields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (partyData.name !== undefined) {
    updateFields.push(`name = $${paramIndex}`);
    params.push(partyData.name);
    paramIndex++;
  }

  if (partyData.symbol !== undefined) {
    updateFields.push(`symbol = $${paramIndex}`);
    params.push(partyData.symbol);
    paramIndex++;
  }

  if (partyData.status !== undefined) {
    updateFields.push(`status = $${paramIndex}`);
    params.push(partyData.status);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    return await getPartyById(id);
  }

  updateFields.push(`updated_at = current_timestamp`);
  params.push(id);

  const query = `
    UPDATE parties 
    SET ${updateFields.join(', ')} 
    WHERE id = $${paramIndex} 
    RETURNING *
  `;

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const deleteParty = async (id: number): Promise<boolean> => {
  const query = `
    DELETE FROM parties 
    WHERE id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rowCount > 0;
};

export const getPartiesWithCandidateCount = async (): Promise<any[]> => {
  const query = `
    SELECT 
      p.*,
      COUNT(c.id) as candidate_count
    FROM parties p
    LEFT JOIN candidates c ON p.id = c.party_id AND c.status = 'active'
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
}; 