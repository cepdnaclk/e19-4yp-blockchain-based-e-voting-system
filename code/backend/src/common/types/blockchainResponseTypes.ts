interface resultType {
  TxId?: string;
  key: string;
  value: string;
  timestamp: Date;
  isDeleted?: boolean;
}

export interface blockchainHistoryResponseType {
  result?: resultType[];
  error?: string;
  errorData?: Date;
}

export interface blockchainRecordResponseType {
  result?: resultType;
  error?: string;
  errorData?: Date;
}
