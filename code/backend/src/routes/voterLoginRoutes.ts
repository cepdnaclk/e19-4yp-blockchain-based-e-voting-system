import { Router } from 'express';
import { registerVoter, voterLogin } from '../controllers/voterLoginController';

const router = Router();

router.post('/userlogin', (req, res) => {
  voterLogin(req, res);
});

router.post('/register', (req, res) => {
  registerVoter(req, res); 
});

export default router; 