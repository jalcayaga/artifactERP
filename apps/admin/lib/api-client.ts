/**
 * API Client for Admin App
 * 
 * Automatically includes Supabase JWT token in all API requests
 */

import { supabase } from '@artifact/core/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export class ApiClient {
    /**
     * Make an authenticated API request
     */
    static async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, ...fetchOptions } = options;

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('No active session. Please login.');
        }

        // Build URL with query params
        let url = `${API_URL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        // Make request with auth header
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
                ...fetchOptions.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || `API Error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * GET request
     */
    static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    /**
     * POST request
     */
    static async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    static async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * PATCH request
     */
    static async patch<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    static async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Example usage:
// const products = await ApiClient.get('/products');
// const newProduct = await ApiClient.post('/products', { name: 'Product 1' });
