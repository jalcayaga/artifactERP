
import fetchWithAuth from './api';
import { Invoice, PaginatedResponse } from '@/lib/types';

export const InvoiceService = {
  async createInvoiceFromOrder(orderId: string): Promise<Invoice> {
    return fetchWithAuth(`/invoices`, {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  async getAllInvoices(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Invoice>> {
    const data = await fetchWithAuth(`/invoices?page=${page}&limit=${limit}`);
    return {
      data: data.data,
      total: data.total,
      page: data.currentPage,
      limit: limit,
    };
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    return fetchWithAuth(`/invoices/${id}`);
  },

  async getInvoicePdf(id: string): Promise<any> {
    return fetchWithAuth(`/invoices/${id}/pdf`);
  },
};
