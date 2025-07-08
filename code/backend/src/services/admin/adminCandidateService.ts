import { dbQuery } from "../common/dbService";
import {
  CandidateType,
  CandidateWithPartyType,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "../../common/types/adminTypes";

export const createCandidate = async (
  candidateData: CreateCandidateRequest
): Promise<CandidateType> => {
  const query = `
    INSERT INTO candidates (
      name, birthday, address, mobile_number, email, photo, 
      party_id, vote_number, election_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
  `;
  const params = [
    candidateData.name,
    candidateData.birthday,
    candidateData.address,
    candidateData.mobileNumber,
    candidateData.email,
    candidateData.photo || null,
    candidateData.partyId || null,
    candidateData.voteNumber,
    candidateData.electionId || null,
  ];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0];
};

export const getAllCandidates = async (): Promise<CandidateWithPartyType[]> => {
  const query = `
    SELECT 
      c.*,
      p.name as party_name,
      p.symbol as party_symbol,
      e.name as election_name
    FROM candidates c
    LEFT JOIN parties p ON c.party_id = p.id
    LEFT JOIN election e ON c.election_id = e.id
    ORDER BY c.created_at DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};

export const getCandidateById = async (
  id: number
): Promise<CandidateWithPartyType | null> => {
  const query = `
    SELECT 
      c.*,
      p.name as party_name,
      p.symbol as party_symbol,
      e.name as election_name
    FROM candidates c
    LEFT JOIN parties p ON c.party_id = p.id
    LEFT JOIN election e ON c.election_id = e.id
    WHERE c.id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const getCandidatesByElection = async (
  electionId: number
): Promise<CandidateWithPartyType[]> => {
  const query = `
    SELECT 
      c.*,
      p.name as party_name,
      p.symbol as party_symbol,
      e.name as election_name
    FROM candidates c
    LEFT JOIN parties p ON c.party_id = p.id
    LEFT JOIN election e ON c.election_id = e.id
    WHERE c.election_id = $1
    ORDER BY c.vote_number
  `;
  const params = [electionId];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows;
};

export const getCandidatesByParty = async (
  partyId: number
): Promise<CandidateWithPartyType[]> => {
  const query = `
    SELECT 
      c.*,
      p.name as party_name,
      p.symbol as party_symbol,
      e.name as election_name
    FROM candidates c
    LEFT JOIN parties p ON c.party_id = p.id
    LEFT JOIN election e ON c.election_id = e.id
    WHERE c.party_id = $1
    ORDER BY c.created_at DESC
  `;
  const params = [partyId];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows;
};

export const getCandidateByEmail = async (
  email: string
): Promise<CandidateType | null> => {
  const query = `
    SELECT * FROM candidates 
    WHERE email = $1
  `;
  const params = [email];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const getCandidateByMobile = async (
  mobileNumber: string
): Promise<CandidateType | null> => {
  const query = `
    SELECT * FROM candidates 
    WHERE mobile_number = $1
  `;
  const params = [mobileNumber];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const getCandidateByVoteNumber = async (
  voteNumber: string,
  electionId?: number
): Promise<CandidateType | null> => {
  let query = `
    SELECT * FROM candidates 
    WHERE vote_number = $1
  `;
  let params = [voteNumber];

  if (electionId) {
    query += ` AND election_id = $2`;
    params.push(electionId.toString());
  }

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rows[0] || null;
};

export const updateCandidate = async (
  id: number,
  candidateData: UpdateCandidateRequest
): Promise<CandidateType | null> => {
  const updateFields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (candidateData.name !== undefined) {
    updateFields.push(`name = $${paramIndex}`);
    params.push(candidateData.name);
    paramIndex++;
  }

  if (candidateData.birthday !== undefined) {
    updateFields.push(`birthday = $${paramIndex}`);
    params.push(candidateData.birthday);
    paramIndex++;
  }

  if (candidateData.address !== undefined) {
    updateFields.push(`address = $${paramIndex}`);
    params.push(candidateData.address);
    paramIndex++;
  }

  if (candidateData.mobileNumber !== undefined) {
    updateFields.push(`mobile_number = $${paramIndex}`);
    params.push(candidateData.mobileNumber);
    paramIndex++;
  }

  if (candidateData.email !== undefined) {
    updateFields.push(`email = $${paramIndex}`);
    params.push(candidateData.email);
    paramIndex++;
  }

  if (candidateData.photo !== undefined) {
    updateFields.push(`photo = $${paramIndex}`);
    params.push(candidateData.photo);
    paramIndex++;
  }

  if (candidateData.partyId !== undefined) {
    updateFields.push(`party_id = $${paramIndex}`);
    params.push(candidateData.partyId);
    paramIndex++;
  }

  if (candidateData.voteNumber !== undefined) {
    updateFields.push(`vote_number = $${paramIndex}`);
    params.push(candidateData.voteNumber);
    paramIndex++;
  }

  if (candidateData.electionId !== undefined) {
    updateFields.push(`election_id = $${paramIndex}`);
    params.push(candidateData.electionId);
    paramIndex++;
  }

  if (candidateData.status !== undefined) {
    updateFields.push(`status = $${paramIndex}`);
    params.push(candidateData.status);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    return await getCandidateById(id);
  }

  updateFields.push(`updated_at = current_timestamp`);
  params.push(id);

  const query = `
    UPDATE candidates 
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

export const deleteCandidate = async (id: number): Promise<boolean> => {
  const query = `
    DELETE FROM candidates 
    WHERE id = $1
  `;
  const params = [id];

  const result = await dbQuery({
    query: query,
    params: params,
  });

  return result.rowCount > 0;
};

export const getCandidatesWithStats = async (): Promise<any[]> => {
  const query = `
    SELECT 
      c.*,
      p.name as party_name,
      p.symbol as party_symbol,
      e.name as election_name,
      COUNT(v.votes_id) as vote_count
    FROM candidates c
    LEFT JOIN parties p ON c.party_id = p.id
    LEFT JOIN election e ON c.election_id = e.id
    LEFT JOIN votes v ON c.id = v.candidate_id
    GROUP BY c.id, p.name, p.symbol, e.name
    ORDER BY c.created_at DESC
  `;

  const result = await dbQuery({
    query: query,
    params: [],
  });

  return result.rows;
};
