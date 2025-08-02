import fetchWithAuth from '../fetchWithAuth';
import { Sale, CreateSaleDto } from '@/lib/types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const SaleService = {
  async getAllSales(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Sale>> {
    const data = await fetchWithAuth(`/sales?page=${page}&limit=${limit}`);
    return {
      data: data.data, // Assuming the API returns { data: [], total: ..., pages: ... }
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    };
  },

  async getSaleById(id: string): Promise<Sale> {
    return fetchWithAuth(`/sales/${id}`);
  },

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    return fetchWithAuth(`/sales`, {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },
};
