import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';
import { updateUserValidator } from '../middleware/validators';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUserValidator, validateRequest, updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
