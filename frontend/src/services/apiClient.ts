import axios from 'axios';

// Production backend: https://capstack-2k25-backend.onrender.com
// Local development: http://localhost:3001
let apiBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// If no env variable, detect environment
if (!apiBaseURL && typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    apiBaseURL = "http://localhost:3001";
  } else {
    apiBaseURL = "https://capstack-2k25-backend.onrender.com";
  }
}

// Ensure no trailing slash
const API_BASE_URL = apiBaseURL ? apiBaseURL.replace(/\/$/, "") : "https://capstack-2k25-backend.onrender.com";

let mlBaseURL = process.env.NEXT_PUBLIC_ML_URL;

// If no env variable, detect environment
if (!mlBaseURL && typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    mlBaseURL = "http://localhost:8000";
  } else {
    mlBaseURL = "https://capstack-ml.onrender.com";
  }
}

// Ensure no trailing slash
const ML_BASE_URL = mlBaseURL ? mlBaseURL.replace(/\/$/, "") : "https://capstack-ml.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Add interceptors for auth tokens