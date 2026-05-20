const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  generateSubtasks,
  predictDeadlines,
  generateStandup,
  getRecommendations,
  askQuestion,
} = require('../controllers/aiController');

// Generate subtasks for a task
router.post('/subtasks', auth, generateSubtasks);

// Predict deadlines
router.post('/predict-deadlines', auth, predictDeadlines);

// Generate daily standup
router.post('/standup', auth, generateStandup);

// Get AI recommendations
router.get('/recommendations', auth, getRecommendations);

// Ask AI a question
router.post('/ask', auth, askQuestion);

module.exports = router;
