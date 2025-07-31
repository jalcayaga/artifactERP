// lib/api.ts
import axios from 'axios';

// Function to get the auth token from wherever it's stored (e.g., localStorage)
const getAuthToken = () => {
  // This is a placeholder. Replace with your actual token storage mechanism.
  return localStorage.getItem('wolfflow_token'); 
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001', // Use an env var for flexibility
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('Auth Token being sent:', token); // For debugging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
