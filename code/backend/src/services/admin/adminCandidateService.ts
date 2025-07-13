import {
  CandidateType,
  CandidateWithPartyType,
  UpdateCandidateRequest,
} from "../../common/types/adminTypes";
import { blockchainResponseType } from "../../common/types/blockchainResponseTypes";
import {
  blockchainFetchByKey,
  blockchainPostPut,
} from "../blockchain/blockchainServices";
import { dbQuery } from "../common/dbService";

export const createCandidate = async (
  candidateData: CandidateType
): Promise<CandidateType> => {
  const candidate: CandidateType = {
    name: candidateData.name,
    birthday: candidateData.birthday,
    address: candidateData.address,
    mobileNumber: candidateData.mobileNumber,
    email: candidateData.email,
    voteNumber: candidateData.voteNumber,
    photo: candidateData.photo ? candidateData.photo : undefined,
    partyId: candidateData.partyId ? candidateData.partyId : undefined,
    electionId: candidateData.electionId ? candidateData.electionId : undefined,
    status: candidateData.status,
    createdAt: candidateData.createdAt || new Date(),
  };
  const response: blockchainResponseType = await blockchainPostPut(
    new Map([["candidate", JSON.stringify(candidate)]]),
    false
  );

  return candidate;
};

export const getAllCandidates = async (): Promise<CandidateType[]> => {
  const candidateHistory: blockchainResponseType = await blockchainFetchByKey(
    "candidate",
    true
  );

  const results = candidateHistory.result || [];

  if (results.length === 0) {
    return [];
  } else {
    const candidates = results.map((result) => {
      const value = JSON.parse(result.value);
      return {
        name: value.name,
        birthday: new Date(value.birthday),
        address: value.address,
        mobileNumber: value.mobileNumber,
        email: value.email,
        photo: value.photo || null,
        partyId: value.partyId || null,
        voteNumber: value.voteNumber,
        electionId: value.electionId || null,
        status: value.status,
        createdAt: new Date(value.createdAt),
        updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
      };
    });
    return candidates;
  }
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
