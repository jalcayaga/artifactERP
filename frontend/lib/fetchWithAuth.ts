import { api } from './api';

interface RequestOptions extends RequestInit {
  body?: any;
}

async function fetchWithAuth(url: string, options?: RequestOptions): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    if (options?.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    const response = await api(url, {
      method: options?.method || 'GET',
      data: options?.body, // Axios uses 'data' for POST/PUT/PATCH body
      headers: headers, // Use the converted headers object
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || error.response.statusText);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
}

export default fetchWithAuth;