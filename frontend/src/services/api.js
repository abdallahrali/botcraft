import axios from 'axios';

/**
 * Pre-configured Axios instance for BotCraft API.
 *
 * Base URL points to the Express backend on port 8000.
 * `withCredentials` ensures session cookies are sent cross-origin.
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Optional: global response interceptor for consistent error handling.
 * Redirects to /login on 401 responses so the user re-authenticates.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we receive 401 and we're not already on an auth page, redirect.
      const path = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
