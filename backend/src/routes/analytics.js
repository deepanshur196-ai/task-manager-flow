const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAnalytics,
  getTeamAnalytics,
} = require('../controllers/analyticsController');

// Get user analytics
router.get('/', auth, getAnalytics);

// Get team analytics for a project
router.get('/team/:projectId', auth, getTeamAnalytics);

module.exports = router;
