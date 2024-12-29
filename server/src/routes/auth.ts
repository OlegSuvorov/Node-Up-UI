import { Router } from 'express'
import { login, register } from '../controllers/authController'
import { loginValidator, registerValidator } from '../middleware/validators'
import { validateRequest } from '../middleware/validateRequest'

const router = Router()

router.post('/login', loginValidator, validateRequest, login)
router.post('/register', registerValidator, validateRequest, register)

export default router 