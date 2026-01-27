import axios from 'axios';

/**
 * Senior Developer Fix: Unified Deployment Strategy
 * Since we are using a single vercel.json for both frontend and backend,
 * we use a relative path. This eliminates CORS issues and double slashes.
 */
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, same-domain requests use an empty string
  : 'http://localhost:8000'; // Development fallback

const api = axios.create({
  // baseURL is now just '/api' for production efficiency
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests using Interceptors
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

// Handle response errors (e.g., Token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const publicPaths = ['/login', '/signup', '/admin-login', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authAPI = {
  signup: async (email, password, name) => {
    // Endpoints are now cleaner and relative
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

// --- Impact Logs API ---
export const impactLogsAPI = {
  create: async (logData) => {
    const { data } = await api.post('/impact-logs', logData);
    return data;
  },
  getMyLogs: async () => {
  const { data } = await api.get('/impact-logs/my-logs'); // No '/api' here if baseURL already includes it
  return data;
},
  getAllLogs: async () => {
    const { data } = await api.get('/impact-logs/all');
    return data;
  },
  updateStatus: async (logId, status) => {
    // PATCH request for administrative status updates
    const { data } = await api.patch(`/impact-logs/${logId}/status`, { status });
    return data;
  },
};

export default api;