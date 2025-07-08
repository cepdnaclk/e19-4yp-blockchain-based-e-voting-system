export const stringToUint8Array = (data: string) =>
  Uint8Array.from(Buffer.from(data, "base64"));

export const uint8ArrayToString = (data: Uint8Array<ArrayBufferLike>) =>
  Buffer.from(data).toString("base64");
