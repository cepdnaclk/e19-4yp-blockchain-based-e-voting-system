import { Request, Response } from 'express';
import { dbQuery } from '../services/dbService';
import bcrypt from 'bcrypt';

export const voterLogin = async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey) {
      return res.status(400).json({ error: 'Secret key is required' });
    }
    const voterResult = await dbQuery({
      query: 'SELECT * FROM voters',
      params: [],
    });

    // Find a voter whose secret_key_hash matches the provided secretKey
    const voter = voterResult.rows.find((row: any) =>
      bcrypt.compareSync(secretKey, row.secret_key_hash)
    );

    if (!voter) {
      return res.status(401).json({ error: 'Invalid secret key' });
    }

    res.status(200).json({ message: 'Login successful', voter_id: voter.id, voter });
  } catch (error) {
    console.error('Error during voter login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerVoter = async (req: Request, res: Response) => {
  const { name, email, password, secretKey } = req.body;
  const hashedSecretKey = await bcrypt.hash(secretKey, 10);
  // ...hash password as well if needed
  await dbQuery({
    query: `INSERT INTO voters (name, email, password, secret_key_hash) VALUES ($1, $2, $3, $4)`,
    params: [name, email, password, hashedSecretKey],
  });
  res.status(201).json({ message: 'Voter registered' });
}; 