import express from 'express';
import auth from '../middleware/auth.js';
import {
  getAnalytics,
  getTeamAnalytics,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Get user analytics
router.get('/', auth(), getAnalytics);

// Get team analytics for a project
router.get('/team/:projectId', auth(), getTeamAnalytics);

export default router;
