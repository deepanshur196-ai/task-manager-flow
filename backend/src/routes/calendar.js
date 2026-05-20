const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCalendarEvents,
  getSprints,
  createEvent,
} = require('../controllers/calendarController');

// Get calendar events
router.get('/events', auth, getCalendarEvents);

// Get sprints for a project
router.get('/sprints/:projectId', auth, getSprints);

// Create calendar event
router.post('/events', auth, createEvent);

module.exports = router;
