import { Request, Response } from "express";
import { dbQuery } from "../services/common/dbService";

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
        query:
          "INSERT INTO votes (voter_id, candidate_id) VALUES ($1, $2) RETURNING created_at",
        params: [voter.id, candidate_id],
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
