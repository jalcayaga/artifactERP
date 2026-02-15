// lib/api.ts
import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.artifact.cl'

// Function to get the auth token from Supabase session in localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  console.log('[api.ts] Getting auth token...');
  console.log('[api.ts] All localStorage keys:', Object.keys(localStorage));

  // Try to get Supabase token from localStorage
  // Supabase stores the session with a key like: sb-{project-ref}-auth-token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];

  console.log('[api.ts] Supabase URL:', supabaseUrl);
  console.log('[api.ts] Project ref:', projectRef);

  if (projectRef) {
    const storageKey = `sb-${projectRef}-auth-token`;
    console.log('[api.ts] Looking for key:', storageKey);
    const sessionData = localStorage.getItem(storageKey);
    console.log('[api.ts] Session data found:', !!sessionData);

    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const token = session.access_token;
        console.log('[api.ts] Token extracted:', token ? 'YES' : 'NO');

        // Decode JWT to inspect (only the payload, not validating signature)
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              console.log('[api.ts] JWT Payload:', payload);
            }
          } catch (e) {
            console.error('[api.ts] Error decoding JWT:', e);
          }
        }

        return token;
      } catch (e) {
        console.error('[api.ts] Error parsing Supabase session:', e);
      }
    }
  }

  // Fallback to old token or new artifact token
  const fallbackToken = localStorage.getItem('artifact_token') || localStorage.getItem('wolfflow_token');
  console.log('[api.ts] Fallback token found:', !!fallbackToken);
  return fallbackToken;
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
      console.log('[api.ts] Authorization header set:', config.headers.Authorization.substring(0, 50) + '...');
    } else {
      console.warn('[api.ts] No token available, request will be sent without Authorization header');
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
