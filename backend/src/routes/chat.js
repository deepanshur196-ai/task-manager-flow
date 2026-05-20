const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getChannels,
  getMessages,
  sendMessage,
  createChannel,
  joinChannel,
} = require('../controllers/chatController');

// Get all channels
router.get('/channels', auth, getChannels);

// Get messages for a channel
router.get('/channels/:channelId/messages', auth, getMessages);

// Send message to a channel
router.post('/channels/:channelId/messages', auth, sendMessage);

// Create new channel
router.post('/channels', auth, createChannel);

// Join a channel
router.post('/channels/:channelId/join', auth, joinChannel);

module.exports = router;
