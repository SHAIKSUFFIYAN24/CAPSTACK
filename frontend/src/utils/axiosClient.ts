import axios, { type InternalAxiosRequestConfig } from "axios";

// Create only ONE axios instance
// Production backend: https://capstack-2k25-backend.onrender.com
// Local development: http://localhost:3001
let baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// If no env variable, detect environment
if (!baseURL && typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    baseURL = "http://localhost:3001";
  } else {
    baseURL = "https://capstack-2k25-backend.onrender.com";
  }
}

// Ensure no trailing slash
const BACKEND_BASE_URL = baseURL ? baseURL.replace(/\/$/, "") : "https://capstack-2k25-backend.onrender.com";

const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
  timeout: 15000, // 15 second timeout for better error handling
});

// Attach token automatically
// Helper to check token expiry by decoding the JWT payload (no external lib)
function isTokenExpired(token: string | null) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(decodeURIComponent(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    ));
    if (!payload || typeof payload !== 'object') return true;
    if (!payload.exp) return true;
    const now = Date.now() / 1000;
    return payload.exp <= now;
  } catch (e) {
    return true;
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // Attach token if available (even if expired - let backend validate)
    if (token) {
      // Attach valid token (normalize if it accidentally contains a 'Bearer ' prefix)
      const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      config.headers = config.headers || ({} as any);
      (config.headers as Record<string, string>).Authorization = `Bearer ${rawToken}`;
    }
  }
  return config;
});

// Response interceptor to handle 401s and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error?.response?.status === 401) {
        // Clear invalid token
        try { localStorage.removeItem('token'); } catch (e) {}
        // Redirect to login if not already there
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (!pathname.startsWith('/auth')) {
            window.location.href = '/auth/login';
          }
        }
      }
    } catch (e) {
      // ignore logging errors
    }
    return Promise.reject(error);
  }
);

export default api;
