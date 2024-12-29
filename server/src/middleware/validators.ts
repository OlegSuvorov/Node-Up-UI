import { body } from 'express-validator';

export const registerValidator = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage('First name must be 2-50 characters long and can only contain letters, spaces, and hyphens'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage('Last name must be 2-50 characters long and can only contain letters, spaces, and hyphens'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Password must be 8-50 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]; 