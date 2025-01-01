import { Router } from 'express';
import {
  login,
  register,
  refresh,
  logout,
  verify,
} from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/verify', verify);

export default router;
