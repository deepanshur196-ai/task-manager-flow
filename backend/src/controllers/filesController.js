// Files Controller
// Handles file uploads, management, and sharing

const getFiles = async (req, res) => {
  try {
    const { projectId, folderId } = req.query;

    // TODO: Fetch files from database based on project/folder
    const files = [
      {
        id: 1,
        name: 'Project Roadmap.pdf',
        type: 'pdf',
        size: '2.4 MB',
        uploaded: '2 days ago',
        owner: 'John Doe',
        shared: 5,
        projectId,
      },
      {
        id: 2,
        name: 'Design Mockups.figma',
        type: 'figma',
        size: '15.8 MB',
        uploaded: '1 week ago',
        owner: 'Jane Smith',
        shared: 8,
        projectId,
      },
    ];

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.body;
    const { userId, name } = req.user;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // TODO: Save file metadata to database
    const file = {
      id: Math.random().toString(36).substr(2, 9),
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      path: req.file.path,
      projectId,
      uploadedBy: userId,
      uploadedByName: name,
      uploadedAt: new Date(),
      shared: [],
    };

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.user;

    // TODO: Delete file from storage and database
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const shareFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userIds, canEdit } = req.body;

    // TODO: Share file with specified users
    res.json({
      success: true,
      message: 'File shared successfully',
      sharedWith: userIds.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFileActivity = async (req, res) => {
  try {
    const { projectId } = req.params;

    // TODO: Fetch recent file activity from database
    const activity = [
      {
        id: 1,
        action: 'uploaded',
        user: 'John Doe',
        file: 'Architecture Diagram.png',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        action: 'shared',
        user: 'Jane Smith',
        file: 'API Documentation.md',
        timestamp: '5 hours ago',
      },
      {
        id: 3,
        action: 'commented',
        user: 'Mike Johnson',
        file: 'Design System.figma',
        timestamp: '1 day ago',
      },
    ];

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFiles,
  uploadFile,
  deleteFile,
  shareFile,
  getFileActivity,
};
