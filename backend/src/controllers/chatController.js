// Chat Controller
// Handles messaging and chat features

const getChannels = async (req, res) => {
  try {
    // TODO: Fetch user's available channels from database
    const channels = [
      { id: 'general', name: 'General', emoji: '💬', members: 12 },
      { id: 'project-alpha', name: 'Project Alpha', emoji: '🚀', members: 8 },
      { id: 'tech-discuss', name: 'Tech Discussion', emoji: '🔧', members: 15 },
      { id: 'announcements', name: 'Announcements', emoji: '📢', members: 30 },
    ];

    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // TODO: Fetch messages from database for the channel
    const messages = [
      {
        id: 1,
        userId: 'user_1',
        username: 'John Doe',
        avatar: '👨',
        content: "Hey team! How's the project coming along?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        channelId,
      },
      {
        id: 2,
        userId: 'user_2',
        username: 'Jane Smith',
        avatar: '👩',
        content: 'Great! Almost finished with the analytics module.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        channelId,
      },
    ];

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { channelId, content, attachment } = req.body;
    const { userId, name } = req.user;

    const message = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      username: name,
      content,
      channelId,
      attachment,
      timestamp: new Date(),
    };

    const io = req.app.get('io');
    if (io && channelId) {
      io.to(channelId).emit('message', {
        id: message.id,
        user: message.username,
        avatar: '👤',
        content: message.content,
        timestamp: message.timestamp,
        channel: message.channelId,
        attachment: message.attachment,
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const { userId } = req.user;

    // TODO: Create channel in database
    const channel = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      isPrivate,
      createdBy: userId,
      members: [userId],
      createdAt: new Date(),
    };

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { userId } = req.user;

    // TODO: Add user to channel in database
    res.json({ success: true, message: 'Joined channel successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getChannels,
  getMessages,
  sendMessage,
  createChannel,
  joinChannel,
};
