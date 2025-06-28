import { Request, Response } from "express";
import { dbQuery } from "../services/common/dbService";
import bcrypt from "bcrypt";

export const voterLogin = async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey) {
      return res.status(400).json({ error: "Secret key is required" });
    }

    console.log("Attempting to fetch voters...");
    const voterResult = await dbQuery({
      query: "SELECT * FROM voters",
      params: [],
    });
    console.log("Voters query result:", voterResult.rows);

    // Find a voter whose secret_key_hash matches the provided secretKey
    const voter = voterResult.rows.find((row: any) =>
      bcrypt.compareSync(secretKey, row.secret_key_hash)
    );

    if (!voter) {
      return res.status(401).json({ error: "Invalid secret key" });
    }

    console.log("Found voter:", { ...voter, secret_key_hash: "[REDACTED]" });

    // Make sure to return voter_id, not the database id
    res.status(200).json({
      message: "Login successful",
      voter_id: voter.voter_id,
      voter: {
        id: voter.id,
        voter_id: voter.voter_id,
        name: voter.name,
        has_voted: voter.has_voted,
      },
    });
  } catch (error) {
    console.error("Detailed login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerVoter = async (req: Request, res: Response) => {
  const { voter_id, name, email, password, secretKey } = req.body;
  const hashedSecretKey = await bcrypt.hash(secretKey, 10);
  // ...hash password as well if needed
  await dbQuery({
    query: `INSERT INTO voters (voter_id, name, email, password, secret_key_hash) VALUES ($1, $2, $3, $4, $5)`,
    params: [voter_id, name, email, password, hashedSecretKey],
  });
  res.status(201).json({ message: "Voter registered" });
};

export const getVoterProfile = async (req: Request, res: Response) => {
  try {
    const { voter_id } = req.params;
    console.log("Fetching profile for voter_id:", voter_id);

    if (!voter_id) {
      return res.status(400).json({ error: "Voter ID is required" });
    }

    // Get voter details
    console.log("Executing voter query...");
    const voterResult = await dbQuery({
      query:
        "SELECT voter_id, name, email, created_at FROM voters WHERE voter_id = $1",
      params: [voter_id],
    });
    console.log("Voter query result:", voterResult.rows);

    if (!voterResult.rows.length) {
      console.log("No voter found with voter_id:", voter_id);
      return res.status(404).json({ error: "Voter not found" });
    }

    const voter = voterResult.rows[0];
    console.log("Found voter:", voter);

    // Get voting history
    console.log("Fetching voting history...");
    const votingHistoryResult = await dbQuery({
      query:
        "SELECT election_name, voted_at, status FROM voting_history WHERE voter_id = $1 ORDER BY voted_at DESC",
      params: [voter.voter_id],
    });
    console.log("Voting history result:", votingHistoryResult.rows);

    const profile = {
      name: voter.name,
      email: voter.email,
      voterId: voter.voter_id,
      registrationDate: voter.created_at,
      votingHistory: votingHistoryResult.rows.map((history: any) => ({
        election: history.election_name,
        date: history.voted_at,
        status: history.status,
      })),
    };

    console.log("Sending profile response:", profile);
    res.status(200).json(profile);
  } catch (error) {
    console.error("Detailed profile error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
