/**
 * Cliente HTTP para consumir la API del backend (Admin)
 */

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.artifact.cl';
const INTERNAL_API_URL =
  process.env.API_URL_INTERNAL || process.env.API_URL || PUBLIC_API_URL;

const resolveBaseUrl = () =>
  typeof window === 'undefined' ? INTERNAL_API_URL : PUBLIC_API_URL;

export interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${resolveBaseUrl()}${endpoint}`;
    if (typeof window !== 'undefined') {
      console.log('API Request [Build: 15:58]:', options.method, url, 'Base resolved from:', resolveBaseUrl(), 'Source:', process.env.NEXT_PUBLIC_API_URL);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (typeof window !== 'undefined') {
      // Priority: wolfflow_token, then artifact_token
      const token = localStorage.getItem('wolfflow_token') || localStorage.getItem('artifact_token');
      if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
      }

      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // Default tenant to 'artifact' if on localhost or no subdomain
      let tenant = 'artifact';
      if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        tenant = parts[0];
      }

      (headers as any)['x-tenant-slug'] = tenant;

      console.log(`[API] Header x-tenant-slug set to: ${tenant} (Hostname: ${hostname})`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Error desconocido',
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiClient = new ApiClient();
