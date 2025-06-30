export interface AdminUserType {
  id: number;
  user_name: string;
  password: string;
  created_at: Date;
}

export interface ElectionType {
  id: number;
  name: string;
  start_date_time: Date;
  end_date_time: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PartyType {
  id: number;
  name: string;
  symbol: string;
  status: 'active' | 'inactive';
  created_at?: Date;
  updated_at?: Date;
}

export interface CandidateType {
  id: number;
  name: string;
  birthday: Date;
  address: string;
  mobile_number: string;
  email: string;
  photo?: string;
  party_id?: number;
  vote_number: string;
  election_id?: number;
  status: 'active' | 'inactive';
  created_at?: Date;
  updated_at?: Date;
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

export interface CreatePartyRequest {
  name: string;
  symbol: string;
}

export interface UpdatePartyRequest {
  name?: string;
  symbol?: string;
  status?: 'active' | 'inactive';
}

export interface CreateCandidateRequest {
  name: string;
  birthday: Date;
  address: string;
  mobileNumber: string;
  email: string;
  photo?: string;
  partyId?: number;
  voteNumber: string;
  electionId?: number;
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
  status?: 'active' | 'inactive';
}
