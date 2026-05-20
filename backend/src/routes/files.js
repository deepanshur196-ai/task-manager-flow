import express from 'express';
import auth from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';
import {
  getFiles,
  uploadFile,
  deleteFile,
  shareFile,
  getFileActivity,
} from '../controllers/filesController.js';

const router = express.Router();

// Get files
router.get('/', auth(), getFiles);

// Upload file (Admin, Project Lead, or Project QL only)
router.post('/upload', auth(['Admin', 'Project Lead', 'Project QL']), upload.single('file'), uploadFile);

// Delete file
router.delete('/:fileId', auth(['Admin', 'Project Lead', 'Project QL']), deleteFile);

// Share file
router.post('/:fileId/share', auth(), shareFile);

// Get file activity
router.get('/activity/:projectId', auth(), getFileActivity);

export default router;
