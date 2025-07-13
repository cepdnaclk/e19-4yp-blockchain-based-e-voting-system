export interface AdminUserType {
  id?: number;
  username: string;
  hashedPassword: string;
  createdAt: Date;
}

export interface ElectionType {
  id?: number;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PartyType {
  id?: number;
  name: string;
  symbol: string;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CandidateType {
  id?: number;
  name: string;
  birthday: Date;
  address: string;
  mobileNumber: string;
  email: string;
  photo?: string;
  partyId?: number;
  voteNumber: string;
  electionId?: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CandidateWithPartyType extends CandidateType {
  party_name?: string;
  party_symbol?: string;
  election_name?: string;
}

export interface CreateElectionRequest {
  name: string;
  startDateTime: Date;
  endDateTime: Date;
}

export interface UpdateElectionRequest {
  name?: string;
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface UpdatePartyRequest {
  name?: string;
  symbol?: string;
  status?: "active" | "inactive";
}

export interface UpdateCandidateRequest {
  name?: string;
  birthday?: Date;
  address?: string;
  mobileNumber?: string;
  email?: string;
  photo?: string;
  partyId?: number;
  voteNumber?: string;
  electionId?: number;
  status?: "active" | "inactive";
}
