import * as paillierBigint from "paillier-bigint";

export const loadPaillierKeysFromEnv = () => {
  const pubKeyStr = process.env.PAILLIER_PUBLIC_KEY;
  const privKeyStr = process.env.PAILLIER_PRIVATE_KEY;
  if (!pubKeyStr || !privKeyStr)
    throw new Error("Paillier keys not found in .env");
  const pubKeyObj = JSON.parse(Buffer.from(pubKeyStr, "base64").toString());
  const privKeyObj = JSON.parse(Buffer.from(privKeyStr, "base64").toString());
  const publicKey = new paillierBigint.PublicKey(
    BigInt(pubKeyObj.n),
    BigInt(pubKeyObj.g)
  );
  const privateKey = new paillierBigint.PrivateKey(
    BigInt(privKeyObj.lambda),
    BigInt(privKeyObj.mu),
    publicKey
  );
  return { publicKey, privateKey };
};
