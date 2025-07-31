import { Client, CreateClientDto, UpdateClientDto } from '@/lib/types';
import fetchWithAuth from './api'; // Importar el nuevo fetchWithAuth

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const ClientService = {
  async getAllClients(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Client>> {
    const data = await fetchWithAuth(`/clients?page=${page}&limit=${limit}`);
    return {
      data: data, // Assuming the API returns an array of clients directly
      total: data.total || data.length,
      page: page,
      limit: limit,
      pages: data.pages || Math.ceil(data.length / limit),
    };
  },

  async getClientById(id: string): Promise<Client> {
    return fetchWithAuth(`/clients/${id}`);
  },

  async createClient(clientData: CreateClientDto): Promise<Client> {
    return fetchWithAuth(`/clients`, {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  async updateClient(id: string, clientData: UpdateClientDto): Promise<Client> {
    return fetchWithAuth(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
    });
  },

  async deleteClient(id: string): Promise<void> {
    await fetchWithAuth(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};
