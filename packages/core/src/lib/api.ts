// lib/api.ts
import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.artifact.cl'

// Function to get the auth token from wherever it's stored (e.g., localStorage)
const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('wolfflow_token')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the auth token in every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Tenant support
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const parts = hostname.split('.')
      // e.g. tenant.domain.com or tenant.localhost
      if (parts.length > 1 && parts[0] !== 'www') {
        config.headers['x-tenant-slug'] = parts[0]
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response, // Simply return good responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch a custom event to signal an auth error
      window.dispatchEvent(new CustomEvent('auth-error'))
    }
    return Promise.reject(error)
  }
)

export { api }
