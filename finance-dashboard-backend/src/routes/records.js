import { Router } from 'express';
import { body, query } from 'express-validator';
import * as recordsController from '../controllers/records.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

// Routes for all authenticated users (Viewer, Analyst, Admin)
router.get('/', [
  authenticateToken,
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest
], recordsController.getAllRecords);

// Routes restricted to Admin
router.post('/', [
  authenticateToken,
  authorizeRoles('Admin'),
  body('amount').isNumeric(),
  body('type').isIn(['income', 'expense']),
  body('category').notEmpty(),
  body('date').isISO8601(),
  validateRequest
], recordsController.createRecord);

router.patch('/:id', [
  authenticateToken,
  authorizeRoles('Admin'),
  body('amount').optional().isNumeric(),
  body('type').optional().isIn(['income', 'expense']),
  body('date').optional().isISO8601(),
  validateRequest
], recordsController.updateRecord);

router.delete('/:id', [
  authenticateToken,
  authorizeRoles('Admin')
], recordsController.deleteRecord);

export default router;
