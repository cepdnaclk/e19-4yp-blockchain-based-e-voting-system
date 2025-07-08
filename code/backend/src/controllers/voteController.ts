import { Request, Response, NextFunction } from "express";
import { dbQuery } from "../services/common/dbService";
import * as paillierBigint from 'paillier-bigint';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const ENCRYPTED_VOTES_FILE = path.join(__dirname, '../../encrypted_votes.json');

// Get all candidates
export const getCandidates = async (req: Request, res: Response) => {
  try {
    console.log("Attempting to fetch candidates...");
    const result = await dbQuery({
      query: "SELECT * FROM candidates",
      params: [],
    });
    console.log("Query result:", result.rows);
    res.status(200).json({ candidates: result.rows });
  } catch (error) {
    console.error("Detailed error in getCandidates:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cast a vote
export const castVote = async (req: Request, res: Response) => {
  try {
    const {
      candidate_id,
      voter_id,
      election_name = "General Election",
    } = req.body;
    if (!candidate_id || !voter_id) {
      return res
        .status(400)
        .json({ error: "Candidate ID and voter ID are required" });
    }

    // Check if voter exists and hasn't voted
    const voterResult = await dbQuery({
      query: "SELECT * FROM voters WHERE voter_id = $1",
      params: [voter_id],
    });
    if (voterResult.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }
    const voter = voterResult.rows[0];
    if (voter.has_voted) {
      return res.status(400).json({ error: "You have already cast your vote" });
    }

    // Check if candidate exists
    const candidateResult = await dbQuery({
      query: "SELECT * FROM candidates WHERE id = $1",
      params: [candidate_id],
    });
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    const candidate = candidateResult.rows[0];

    // Start a transaction to ensure all operations succeed or fail together
    await dbQuery({
      query: "BEGIN",
      params: [],
    });

    try {
      // Record vote in votes table with timestamp
      const voteResult = await dbQuery({
        query: 'INSERT INTO votes (voter_id, candidate_id) VALUES ($1, $2) RETURNING created_at',
        params: [voter.voter_id, candidate_id],
      });

      const voteTimestamp = voteResult.rows[0].created_at;

      // Record in voting history table
      await dbQuery({
        query:
          "INSERT INTO voting_history (voter_id, election_name, voted_at, status) VALUES ($1, $2, $3, $4)",
        params: [voter.voter_id, election_name, voteTimestamp, "Voted"],
      });

      // Update voter's has_voted status
      await dbQuery({
        query:
          "UPDATE voters SET has_voted = true, updated_at = CURRENT_TIMESTAMP WHERE voter_id = $1",
        params: [voter.voter_id],
      });

      // Commit the transaction
      await dbQuery({
        query: "COMMIT",
        params: [],
      });

      // Encrypt the vote (1 for selected candidate) and store in JSON file
      try {
        const { publicKey } = loadPaillierKeys();
        const encryptedVote = publicKey.encrypt(1n);
        saveEncryptedVote(candidate_id.toString(), encryptedVote.toString());
        console.log(`Encrypted vote for candidate ${candidate_id} saved.`);
      } catch (encErr) {
        console.error('Error encrypting vote:', encErr);
      }

      // Return success with vote details
      res.status(200).json({
        message: "Vote cast successfully",
        vote: {
          election: election_name,
          candidate: candidate.name,
          timestamp: voteTimestamp,
          status: "Voted",
        },
      });
    } catch (error) {
      // If any error occurs, rollback the transaction
      await dbQuery({
        query: "ROLLBACK",
        params: [],
      });
      throw error;
    }
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get voting results
export const getResults = async (req: Request, res: Response) => {
  try {
    const result = await dbQuery({
      query: `
        SELECT 
          c.id,
          c.name,
          c.party,
          c.position,
          c.image_url,
          COUNT(v.id) as votes,
          ROUND(COUNT(v.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM votes), 0), 2) as percentage
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        GROUP BY c.id
        ORDER BY votes DESC
      `,
      params: [],
    });
    res.status(200).json({ results: result.rows });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper to load Paillier keys from .env
function loadPaillierKeys() {
  const pubKeyStr = process.env.PAILLIER_PUBLIC_KEY;
  const privKeyStr = process.env.PAILLIER_PRIVATE_KEY;
  if (!pubKeyStr || !privKeyStr) throw new Error('Paillier keys not found in .env');
  const pubKeyObj = JSON.parse(Buffer.from(pubKeyStr, 'base64').toString());
  const privKeyObj = JSON.parse(Buffer.from(privKeyStr, 'base64').toString());
  const publicKey = new paillierBigint.PublicKey(BigInt(pubKeyObj.n), BigInt(pubKeyObj.g));
  const privateKey = new paillierBigint.PrivateKey(
    BigInt(privKeyObj.lambda),
    BigInt(privKeyObj.mu),
    publicKey
  );
  return { publicKey, privateKey };
}

// Demo endpoint for homomorphic encryption
export const homomorphicDemo = async (req: Request, res: Response) => {
  try {
    const { publicKey, privateKey } = loadPaillierKeys();
    // Encrypt two votes (1 and 1)
    const vote1 = 1n;
    const vote2 = 1n;
    const encryptedVote1 = publicKey.encrypt(vote1);
    const encryptedVote2 = publicKey.encrypt(vote2);
    console.log('Encrypted vote 1:', encryptedVote1.toString());
    console.log('Encrypted vote 2:', encryptedVote2.toString());
    // Homomorphic addition
    const encryptedSum = publicKey.addition(encryptedVote1, encryptedVote2);
    console.log('Encrypted sum:', encryptedSum.toString());
    // Decrypt the sum
    const tally = privateKey.decrypt(encryptedSum);
    console.log('Decrypted tally:', tally.toString());
    res.status(200).json({
      encryptedVote1: encryptedVote1.toString(),
      encryptedVote2: encryptedVote2.toString(),
      encryptedSum: encryptedSum.toString(),
      decryptedTally: tally.toString(),
    });
  } catch (error) {
    console.error('Homomorphic encryption demo error:', error);
    res.status(500).json({ error: 'Homomorphic encryption demo failed' });
  }
};

function saveEncryptedVote(candidateId: string, encryptedVote: string) {
  let data: Record<string, string[]> = {};
  if (fs.existsSync(ENCRYPTED_VOTES_FILE)) {
    data = JSON.parse(fs.readFileSync(ENCRYPTED_VOTES_FILE, 'utf-8'));
  }
  if (!data[candidateId]) data[candidateId] = [];
  data[candidateId].push(encryptedVote);
  fs.writeFileSync(ENCRYPTED_VOTES_FILE, JSON.stringify(data, null, 2));
}

// Tally and decrypt votes for a candidate
export const tallyVotes = (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const candidateId = req.params.candidateId;
      if (!candidateId) return res.status(400).json({ error: 'Candidate ID required' });
      if (!fs.existsSync(ENCRYPTED_VOTES_FILE)) return res.status(404).json({ error: 'No votes found' });
      const data: Record<string, string[]> = JSON.parse(fs.readFileSync(ENCRYPTED_VOTES_FILE, 'utf-8'));
      const encryptedVotes = data[candidateId];
      if (!encryptedVotes || encryptedVotes.length === 0) return res.status(404).json({ error: 'No votes for this candidate' });
      const { publicKey, privateKey } = loadPaillierKeys();
      // Homomorphically add all encrypted votes
      let encryptedSum = BigInt(encryptedVotes[0]);
      for (let i = 1; i < encryptedVotes.length; i++) {
        encryptedSum = publicKey.addition(encryptedSum, BigInt(encryptedVotes[i]));
      }
      // Decrypt the sum
      const tally = privateKey.decrypt(encryptedSum);
      res.status(200).json({
        candidateId,
        encryptedSum: encryptedSum.toString(),
        decryptedTally: tally.toString(),
      });
    } catch (error) {
      console.error('Tally votes error:', error);
      res.status(500).json({ error: 'Tally votes failed' });
    }
  })();
};

