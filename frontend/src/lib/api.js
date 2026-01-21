import axios from 'axios';

// Fallback to localhost:8000 if the environment variable is missing
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  // This ensures the base is always a valid URL
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      const publicPaths = ['/login', '/signup', '/admin-login', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (email, password, name) => {
    // Note: removed unnecessary try/catch blocks because the interceptor 
    // and the calling component usually handle the error display.
    const { data } = await api.post('/auth/signup', { email, password, name });
    return data;
  },
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Impact Logs API
export const impactLogsAPI = {
  create: async (logData) => {
    const { data } = await api.post('/impact-logs', logData);
    return data;
  },
  getMyLogs: async () => {
    const { data } = await api.get('/impact-logs/my-logs');
    return data;
  },
  getAllLogs: async () => {
    const { data } = await api.get('/impact-logs/all');
    return data;
  },
  updateStatus: async (logId, status) => {
    const { data } = await api.patch(`/impact-logs/${logId}/status`, { status });
    return data;
  },
};

export default api;