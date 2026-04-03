import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Routes restricted to Admin and Analyst
router.get('/summary', [
  authenticateToken,
  authorizeRoles('Admin', 'Analyst')
], dashboardController.getSummary);

router.get('/trends', [
  authenticateToken,
  authorizeRoles('Admin', 'Analyst')
], dashboardController.getTrends);

export default router;
