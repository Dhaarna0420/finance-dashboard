import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post('/register', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest
], authController.register);

router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
  validateRequest
], authController.login);

export default router;
