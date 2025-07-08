import { randomBytes } from "crypto";

export const randomStringGenerator = (length: number) => {
  return randomBytes(length).toString("base64").slice(0, length);
};
