import express from 'express';
import auth from '../middleware/auth.js';
import {
  getChannels,
  getMessages,
  sendMessage,
  createChannel,
  joinChannel,
} from '../controllers/chatController.js';

const router = express.Router();

// Get all channels
router.get('/channels', auth(), getChannels);

// Get messages for a channel
router.get('/channels/:channelId/messages', auth(), getMessages);

// Send message to a channel
router.post('/channels/:channelId/messages', auth(), sendMessage);

// Create new channel
router.post('/channels', auth(), createChannel);

// Join a channel
router.post('/channels/:channelId/join', auth(), joinChannel);

export default router;
