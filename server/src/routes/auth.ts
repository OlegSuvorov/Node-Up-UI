import { Router } from 'express';
import {
  login,
  register,
  logout,
  verify,
} from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidator, loginValidator } from '../middleware/validators';

const router = Router();

router.post('/login', loginValidator, validateRequest, login);
router.post('/register', registerValidator, validateRequest, register);
router.post('/logout', logout);
router.get('/verify', verify);

export default router;
