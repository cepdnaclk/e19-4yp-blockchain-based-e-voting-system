import { generateRandomKeys } from 'paillier-bigint';

(async () => {
  const { publicKey, privateKey } = await generateRandomKeys(2048);

  // Manually serialize key parameters
  const pubKeyObj = {
    n: publicKey.n.toString(),
    g: publicKey.g.toString(),
  };
  const privKeyObj = {
    lambda: privateKey.lambda.toString(),
    mu: privateKey.mu.toString(),
    publicKey: pubKeyObj,
  };

  const pubKeyStr = Buffer.from(JSON.stringify(pubKeyObj)).toString('base64');
  const privKeyStr = Buffer.from(JSON.stringify(privKeyObj)).toString('base64');

  console.log('Copy the following lines into your .env file:');
  console.log(`PAILLIER_PUBLIC_KEY=${pubKeyStr}`);
  console.log(`PAILLIER_PRIVATE_KEY=${privKeyStr}`);
})(); 