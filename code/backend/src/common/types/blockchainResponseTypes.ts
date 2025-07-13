export interface blockchainResponseType {
  result?: resultType[];
  error?: string;
  errorData?: Date;
}

interface resultType {
  TxId: string;
  key: string;
  value: string;
  timestamp: Date;
  isDeleted: boolean;
}
