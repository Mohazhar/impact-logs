import axios from 'axios';

/**
 * Unified Deployment Strategy
 * We explicitly point to the production Vercel URL to avoid 404/405 errors
 * caused by relative path ambiguity during client-side routing.
 */
const PROD_URL = 'https://impact-logs-three.vercel.app';
const API_URL = process.env.NODE_ENV === 'production' 
  ? PROD_URL 
  : 'http://localhost:8000';

const api = axios.create({
  // baseURL is consistently formatted to prevent double slashes or missing prefixes
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 

// Add token to requests using Interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure Bearer token format is strictly followed
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (e.g., Token expiration or server crashes)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: Unauthorized - usually means token expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const publicPaths = ['/login', '/signup', '/admin-login', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    // 500: Server Error - log details for debugging
    if (error.response?.status === 500) {
      console.error("Backend Server Error (500): Check database connection.");
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authAPI = {
  signup: async (email, password, name) => {
    // POST request to /api/auth/signup
    const { data } = await api.post('/auth/signup', { email, password, name });
    return data;
  },
  login: async (email, password) => {
    // POST request to /api/auth/login
    // Explicitly avoids trailing slashes which can cause 405 Method Not Allowed
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
  // Added a public stats method to verify connectivity
  getStats: async () => {
    const { data } = await api.get('/public/stats');
    return data;
  }
};

export default api;