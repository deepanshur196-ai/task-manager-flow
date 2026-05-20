import express from 'express';
import auth from '../middleware/auth.js';
import {
  getCalendarEvents,
  getSprints,
  createEvent,
} from '../controllers/calendarController.js';

const router = express.Router();

// Get calendar events
router.get('/events', auth(), getCalendarEvents);

// Get sprints for a project
router.get('/sprints/:projectId', auth(), getSprints);

// Create calendar event
router.post('/events', auth(), createEvent);

export default router;
