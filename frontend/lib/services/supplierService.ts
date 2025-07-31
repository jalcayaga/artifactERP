import fetchWithAuth from './api';
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from '@/lib/types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const SupplierService = {
  async getAllSuppliers(page?: number, limit?: number): Promise<PaginatedResponse<Supplier> | Supplier[]> {
    if (page && limit) {
      const data = await fetchWithAuth(`/suppliers?page=${page}&limit=${limit}`);
      return {
        data: data.data,
        total: data.total,
        page: data.currentPage,
        limit: limit,
        pages: data.pages,
      };
    }
    return fetchWithAuth(`/suppliers`);
  },

  async getSupplierById(id: string): Promise<Supplier> {
    return fetchWithAuth(`/suppliers/${id}`);
  },

  async createSupplier(supplierData: CreateSupplierDto): Promise<Supplier> {
    return fetchWithAuth(`/suppliers`, {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  async updateSupplier(id: string, supplierData: UpdateSupplierDto): Promise<Supplier> {
    return fetchWithAuth(`/suppliers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(supplierData),
    });
  },

  async deleteSupplier(id: string): Promise<void> {
    await fetchWithAuth(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  },
};
