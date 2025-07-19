export interface voteRecordType {
  voterSecretKeyHash: string;
  hasVoted: boolean;
  votedAt: Date;
  candidateId: number;
  electionId: number;
  partyId: number;
}
