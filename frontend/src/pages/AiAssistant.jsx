import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hey! I\'m your AI Assistant. I can help you with:',
      timestamp: new Date(Date.now() - 5 * 60000),
      suggestions: [
        'Generate subtasks',
        'Predict deadlines',
        'Analyze project risks',
        'Smart recommendations'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setLoading(true);
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Based on your project timeline, I\'d suggest breaking it down into smaller tasks.',
        'I\'ve analyzed your data and found that Project Alpha might face delays due to resource constraints.',
        'Here are my recommendations: prioritize the critical path items and redistribute tasks for better balance.',
        'Based on your team\'s velocity, I predict this sprint will be completed by May 28th with a 95% confidence.'
      ];
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🤖 AI Assistant</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {/* Chat Messages */}
            <div className="bg-white rounded-lg shadow-md flex-1 p-6 mb-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestion(suggestion)}
                              className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded transition"
                            >
                              → {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your projects..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-4">
            {/* Generate Subtasks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>✂️</span> Generate Subtasks
              </h3>
              <p className="text-sm text-gray-600 mb-3">Automatically break down complex tasks into smaller, manageable pieces.</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Generate
              </button>
            </div>

            {/* Predict Deadlines */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎯</span> Predict Deadlines
              </h3>
              <p className="text-sm text-gray-600 mb-3">Get AI-powered deadline predictions based on your team's velocity.</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Analyze
              </button>
            </div>

            {/* Daily Standup */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📝</span> Daily Standup
              </h3>
              <p className="text-sm text-gray-600 mb-3">Generate standup summaries automatically from your tasks.</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Generate
              </button>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span> Recommendations
              </h3>
              <p className="text-sm text-gray-600 mb-3">Get smart insights to optimize your workflow.</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                View All
              </button>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚠️</span> Risk Analysis
              </h3>
              <div className="space-y-2 mb-3">
                <div className="text-xs">
                  <span className="text-red-600 font-semibold">🔴 High Risk:</span>
                  <p className="text-gray-600">Project Alpha delayed by 5 days</p>
                </div>
                <div className="text-xs">
                  <span className="text-yellow-600 font-semibold">🟡 Medium Risk:</span>
                  <p className="text-gray-600">Team capacity at 92%</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
