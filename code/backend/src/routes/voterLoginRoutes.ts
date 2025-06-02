import { Router } from 'express';
import { registerVoter, voterLogin, getVoterProfile } from '../controllers/voterLoginController';

const router = Router();

router.post('/userlogin', (req, res) => {
  voterLogin(req, res);
});

router.post('/register', (req, res) => {
  registerVoter(req, res); 
});

router.get('/profile/:voter_id', (req, res) => {
  getVoterProfile(req, res);
});

export default router; 