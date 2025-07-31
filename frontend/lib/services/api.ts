
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = {}): Promise<any> {
  const token = options.token || localStorage.getItem('wolfflow_token');
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    ...(options.headers as { [key: string]: string } || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token inválido o expirado, redirigir al login
      localStorage.removeItem('wolfflow_token');
      // No podemos usar useRouter directamente aquí, esto se manejará en el nivel de la UI
      throw new Error('Unauthorized: Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error; // Re-throw para que el componente de UI lo maneje
  }
}

export default fetchWithAuth;
