import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Analytics APIs
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
  getTeamAnalytics: (projectId) => api.get(`/analytics/team/${projectId}`),
};

// Calendar APIs
export const calendarAPI = {
  getEvents: (params) => api.get('/calendar/events', { params }),
  getSprints: (projectId) => api.get(`/calendar/sprints/${projectId}`),
  createEvent: (data) => api.post('/calendar/events', data),
};

// AI Assistant APIs
export const aiAPI = {
  generateSubtasks: (data) => api.post('/ai/subtasks', data),
  predictDeadlines: (data) => api.post('/ai/predict-deadlines', data),
  generateStandup: (data) => api.post('/ai/standup', data),
  getRecommendations: () => api.get('/ai/recommendations'),
  askQuestion: (data) => api.post('/ai/ask', data),
};

// Chat APIs
export const chatAPI = {
  getChannels: () => api.get('/chat/channels'),
  getMessages: (channelId, params) => api.get(`/chat/channels/${channelId}/messages`, { params }),
  sendMessage: (channelId, data) => api.post(`/chat/channels/${channelId}/messages`, data),
  createChannel: (data) => api.post('/chat/channels', data),
  joinChannel: (channelId) => api.post(`/chat/channels/${channelId}/join`),
};

// Files APIs
export const filesAPI = {
  getFiles: (params) => api.get('/files', { params }),
  uploadFile: (formData) => api.post('/files/upload', formData),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
  shareFile: (fileId, data) => api.post(`/files/${fileId}/share`, data),
  getFileActivity: (projectId) => api.get(`/files/activity/${projectId}`),
};

export default api;
