import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';

export default function Chat() {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messages, setMessages] = useState([
    { id: 1, user: 'John Doe', avatar: '👨', content: 'Hey team! How\'s the project coming along?', timestamp: '10:30 AM', channel: 'general' },
    { id: 2, user: 'Jane Smith', avatar: '👩', content: 'Great! Almost finished with the analytics module.', timestamp: '10:32 AM', channel: 'general' },
    { id: 3, user: 'Mike Johnson', avatar: '👨‍💼', content: '@John We need to discuss the timeline for next sprint.', timestamp: '10:35 AM', channel: 'general' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const channels = [
    { id: 'general', name: 'General', emoji: '💬', members: 12 },
    { id: 'project-alpha', name: 'Project Alpha', emoji: '🚀', members: 8 },
    { id: 'tech-discuss', name: 'Tech Discussion', emoji: '🔧', members: 15 },
    { id: 'announcements', name: 'Announcements', emoji: '📢', members: 30 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Socket.io listeners
    const socket = getSocket();
    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: user?.name || 'Anonymous',
      avatar: '👤',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      channel: selectedChannel,
    };

    setMessages([...messages, newMessage]);
    
    // Emit through Socket.io (TODO: implement backend)
    const socket = getSocket();
    socket.emit('sendMessage', newMessage);
    
    setInput('');
  };

  const channelMessages = messages.filter(msg => msg.channel === selectedChannel);

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
              {channels.map(channel => (
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
                  {channels.find(c => c.id === selectedChannel)?.emoji} {channels.find(c => c.id === selectedChannel)?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {channels.find(c => c.id === selectedChannel)?.members} members
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
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
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
              <div className="mt-3 flex gap-2 text-gray-600 text-sm">
                <button type="button" className="hover:text-gray-800">📎 Attach</button>
                <button type="button" className="hover:text-gray-800">🎤 Voice</button>
                <button type="button" className="hover:text-gray-800">😊 Emoji</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
