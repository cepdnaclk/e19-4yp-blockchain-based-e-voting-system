import { Router } from 'express';
import { voterLogin } from '../controllers/voterLoginController';

const router = Router();

router.post('/userlogin', (req, res) => {
  voterLogin(req, res);
});

export default router; 