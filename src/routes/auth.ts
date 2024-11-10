import express from 'express';
import { body } from 'express-validator';
// Fix the import path to match the actual middleware location
import { validateRequest } from '../middleware/validateRequest';
import { register, login } from '../controllers/authController';


const router = express.Router();

const registerValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

export default router;