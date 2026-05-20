const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getFiles,
  uploadFile,
  deleteFile,
  shareFile,
  getFileActivity,
} = require('../controllers/filesController');

// Get files
router.get('/', auth, getFiles);

// Upload file
router.post('/upload', auth, uploadFile);

// Delete file
router.delete('/:fileId', auth, deleteFile);

// Share file
router.post('/:fileId/share', auth, shareFile);

// Get file activity
router.get('/activity/:projectId', auth, getFileActivity);

module.exports = router;
