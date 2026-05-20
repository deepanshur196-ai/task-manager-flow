import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import File from '../models/File.js';
import Project from '../models/Project.js';

const getFiles = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: 'Invalid projectId' });
      }
      filter.projectId = projectId;
    }

    const files = await File.find(filter).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Valid projectId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const project = await Project.findById(projectId).select('_id');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const extension = path.extname(req.file.originalname).slice(1).toLowerCase();

    const file = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      type: extension || req.file.mimetype,
      path: `/uploads/${req.file.filename}`,
      storagePath: req.file.path,
      projectId,
      uploadedBy: req.user.id,
      uploadedByName: req.user.name,
      uploadedAt: new Date(),
      shared: [],
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const storagePath = file.storagePath || file.path?.replace(/^\//, '');
    if (storagePath) {
      const absolutePath = path.resolve(storagePath);
      await fs.unlink(absolutePath).catch((err) => {
        if (err.code !== 'ENOENT') throw err;
      });
    }

    await file.remove();
    res.json({ success: true, message: 'File deleted successfully', fileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const shareFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds are required to share the file' });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const validIds = userIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    file.shared = Array.from(new Set([...(file.shared || []).map((id) => id.toString()), ...validIds]));
    await file.save();

    res.json({
      success: true,
      message: 'File shared successfully',
      sharedWith: file.shared.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFileActivity = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid projectId' });
    }

    const files = await File.find({ projectId }).sort({ updatedAt: -1 }).limit(10);
    const activity = files.map((file) => ({
      id: file._id,
      action: 'uploaded',
      user: file.uploadedByName,
      file: file.name,
      timestamp: file.uploadedAt ? file.uploadedAt.toISOString() : '',
    }));

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getFiles,
  uploadFile,
  deleteFile,
  shareFile,
  getFileActivity,
};
