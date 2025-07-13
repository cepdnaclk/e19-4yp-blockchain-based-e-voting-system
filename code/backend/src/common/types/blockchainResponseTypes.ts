export interface blockchainResponseTypes {
  status: number;
  result?: resultType[];
  error?: string;
  errorData?: Date;
}

interface resultType {
  TxId: string;
  value: {
    key: string;
    hash?: string;
  };
  timestamp: Date;
  isDeleted: boolean;
}
