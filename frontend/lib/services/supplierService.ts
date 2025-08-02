import { Company } from '@/lib/types';
import apiService from './apiService';

export const SupplierService = {
  getAllSuppliers: async (): Promise<Company[]> => {
    const response = await apiService.get<Company[]>('/companies', { params: { isSupplier: true } });
    return response.data;
  },

  getSupplierById: async (id: string): Promise<Company> => {
    const response = await apiService.get<Company>(`/companies/${id}`);
    return response.data;
  },

  createSupplier: async (supplierData: Partial<Company>): Promise<Company> => {
    const response = await apiService.post<Company>('/companies', { ...supplierData, isSupplier: true });
    return response.data;
  },

  updateSupplier: async (id: string, supplierData: Partial<Company>): Promise<Company> => {
    const response = await apiService.patch<Company>(`/companies/${id}`, supplierData);
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await apiService.delete(`/companies/${id}`);
  },
};
