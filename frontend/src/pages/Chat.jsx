import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { chatAPI, filesAPI } from '../services/api';

const defaultChannels = [
  { id: 'general', name: 'General', emoji: '💬', members: 12 },
  { id: 'project-alpha', name: 'Project Alpha', emoji: '🚀', members: 8 },
  { id: 'tech-discuss', name: 'Tech Discussion', emoji: '🔧', members: 15 },
  { id: 'announcements', name: 'Announcements', emoji: '📢', members: 30 },
];

export default function Chat() {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const effectiveChannels = channels.length ? channels : defaultChannels;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (!selectedChannel) return;
    joinChannel(selectedChannel);
    loadMessages(selectedChannel);
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('message', (data) => {
      if (data.channel === selectedChannel) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [selectedChannel]);

  const loadChannels = async () => {
    try {
      const { data } = await chatAPI.getChannels();
      setChannels(data);
      if (!selectedChannel && data.length) {
        setSelectedChannel(data[0].id);
      }
    } catch (error) {
      console.error('Error loading chat channels:', error);
    }
  };

  const loadMessages = async (channelId) => {
    try {
      const { data } = await chatAPI.getMessages(channelId);
      setMessages(data.map((message) => ({
        id: message.id,
        user: message.username || message.user,
        avatar: message.avatar || '👤',
        content: message.content,
        timestamp: message.timestamp ? new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        channel: message.channelId || message.channel || channelId,
        attachment: message.attachment,
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const joinChannel = (channelId) => {
    const socket = getSocket();
    socket.emit('joinChannel', channelId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      user: user?.name || 'Anonymous',
      avatar: '👤',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      channel: selectedChannel,
    };

    setMessages((prev) => [...prev, newMessage]);
    getSocket().emit('sendMessage', newMessage);
    setInput('');
  };

  const canUpload = user && (user.role === 'Admin' || ['Project Lead', 'Project QL'].includes(user.designation));

  const handleAttachmentClick = () => {
    if (!canUpload) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    if (!canUpload) {
      console.warn('Upload denied: insufficient permissions');
      event.target.value = '';
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await filesAPI.uploadFile(formData);

      const attachmentMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        user: user?.name || 'Anonymous',
        avatar: '👤',
        content: `Sent a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        channel: selectedChannel,
        attachment: {
          name: file.name,
          url: data.path,
        },
      };

      setMessages((prev) => [...prev, attachmentMessage]);
      getSocket().emit('sendMessage', attachmentMessage);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const channelMessages = messages.filter((msg) => msg.channel === selectedChannel);

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">💬 Team Chat</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen max-h-screen">
          {/* Channels Sidebar */}
          <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 mb-4">Channels</h2>
              <input
                type="text"
                placeholder="Search channels..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {effectiveChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${
                    selectedChannel === channel.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{channel.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{channel.name}</div>
                      <div className="text-xs text-gray-500">{channel.members} members</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                + New Channel
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
            {/* Channel Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {effectiveChannels.find(c => c.id === selectedChannel)?.emoji} {effectiveChannels.find(c => c.id === selectedChannel)?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {effectiveChannels.find(c => c.id === selectedChannel)?.members} members
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition">
                  🔔
                </button>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition">
                  ⚙️
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {channelMessages.map(message => (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {message.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{message.user}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mt-1 break-words">{message.content}</p>
                    {message.attachment && (
                      <div className="mt-2">
                        <a
                          href={message.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          {message.attachment.name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="mt-3 flex gap-2 text-gray-600 text-sm items-center">
                <button
                  type="button"
                  onClick={handleAttachmentClick}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={!canUpload || uploading}
                >
                  📎 Attach
                </button>
                <span>{uploading ? 'Uploading file...' : canUpload ? 'Attach a file to share in chat' : 'Upload restricted to Admin, Project Lead, or Project QL.'}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
