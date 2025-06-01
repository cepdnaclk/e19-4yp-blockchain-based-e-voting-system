import express, { Request, Response } from 'express';
import { Router } from 'express';
import { getCandidates, castVote, getResults } from '../controllers/voteController';

const router = Router();

// Status route
router.get('/status', (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: 'Voting system is active' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route for testing
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Vote routes are working' });
});

// Get all candidates
router.get('/candidates', getCandidates);

// Cast a vote
//router.post('/cast', castVote);

// Get voting results
router.get('/results', getResults);

// TODO: Add vote-related routes

export default router; 