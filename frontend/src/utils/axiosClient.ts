import axios, { type InternalAxiosRequestConfig } from "axios";

// Create only ONE axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://capstack-2k25-backend.onrender.com" || "http://localhost:3001",
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: log that a token was attached (safe to remove later)
      // eslint-disable-next-line no-console
      console.debug("axiosClient: attaching token to request", token ? token.substring(0, 20) + '...' : null);
    } else {
      // eslint-disable-next-line no-console
      console.debug("axiosClient: no token found in localStorage");
    }
  }
  return config;
});

// Response interceptor to log 401s for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error?.response?.status === 401) {
        // eslint-disable-next-line no-console
        console.warn("axiosClient: received 401 Unauthorized from API", error.response?.config?.url);
        // For demo mode, don't redirect to login
        // Clear stored token and redirect to login so the app can re-authenticate
        // try {
        //   localStorage.removeItem("token");
        // } catch (e) {
        //   // ignore
        // }
        // if (typeof window !== "undefined") {
        //   // Avoid infinite redirect loops for auth routes
        //   const pathname = window.location.pathname;
        //   if (!pathname.startsWith("/auth")) {
        //     window.location.href = "/auth/login";
        //   }
        // }
      }
    } catch (e) {
      // ignore logging errors
    }
    return Promise.reject(error);
  }
);

export default api;
