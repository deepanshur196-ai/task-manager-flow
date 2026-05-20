import express from 'express';
import auth from '../middleware/auth.js';
import {
  generateSubtasks,
  predictDeadlines,
  generateStandup,
  getRecommendations,
  askQuestion,
} from '../controllers/aiController.js';

const router = express.Router();

// Generate subtasks for a task
router.post('/subtasks', auth(), generateSubtasks);

// Predict deadlines
router.post('/predict-deadlines', auth(), predictDeadlines);

// Generate daily standup
router.post('/standup', auth(), generateStandup);

// Get AI recommendations
router.get('/recommendations', auth(), getRecommendations);

// Ask AI a question
router.post('/ask', auth(), askQuestion);

export default router;
