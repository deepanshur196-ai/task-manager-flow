import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    completionRate: 0,
    delayedTasks: 0,
    weeklyPerformance: [],
    teamEfficiency: 0,
    focusHours: 0,
    burnoutRisk: 'Low',
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const mockData = {
        completionRate: 78,
        delayedTasks: 5,
        weeklyPerformance: [
          { day: 'Mon', tasks: 8, completed: 6 },
          { day: 'Tue', tasks: 12, completed: 10 },
          { day: 'Wed', tasks: 7, completed: 7 },
          { day: 'Thu', tasks: 10, completed: 8 },
          { day: 'Fri', tasks: 15, completed: 12 },
          { day: 'Sat', tasks: 3, completed: 3 },
          { day: 'Sun', tasks: 2, completed: 2 },
        ],
        teamEfficiency: 82,
        focusHours: 34.5,
        burnoutRisk: 'Low',
        taskStatus: [
          { name: 'Completed', value: 78, color: '#10b981' },
          { name: 'In Progress', value: 15, color: '#3b82f6' },
          { name: 'Pending', value: 7, color: '#f59e0b' },
        ],
      };
      setAnalytics(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Completion Rate</div>
            <div className="text-4xl font-bold text-green-600">{analytics.completionRate}%</div>
            <div className="text-gray-500 text-xs mt-2">✓ Tasks completed this month</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Delayed Tasks</div>
            <div className="text-4xl font-bold text-orange-600">{analytics.delayedTasks}</div>
            <div className="text-gray-500 text-xs mt-2">⚠️ Tasks past deadline</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Team Efficiency</div>
            <div className="text-4xl font-bold text-blue-600">{analytics.teamEfficiency}%</div>
            <div className="text-gray-500 text-xs mt-2">👥 Team productivity score</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Focus Hours</div>
            <div className="text-4xl font-bold text-purple-600">{analytics.focusHours}h</div>
            <div className="text-gray-500 text-xs mt-2">🧠 Deep work this week</div>
          </div>
        </div>

        {/* Burnout Detection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Burnout Detection</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Current Risk Level</div>
              <div className={`text-3xl font-bold mt-2 ${
                analytics.burnoutRisk === 'Low' ? 'text-green-600' :
                analytics.burnoutRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analytics.burnoutRisk}
              </div>
            </div>
            <div className="w-48 h-16 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Performance Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#3b82f6" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.taskStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.taskStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Task Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Task Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="tasks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Completion Rate</span>
                  <span className="text-sm font-semibold text-green-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">Team Efficiency</span>
                  <span className="text-sm font-semibold text-blue-600">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700">On-Time Delivery</span>
                  <span className="text-sm font-semibold text-purple-600">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
