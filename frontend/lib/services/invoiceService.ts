import fetchWithAuth from '../fetchWithAuth';
import { Invoice, PaginatedResponse, InvoiceStatus } from '@/lib/types';

export const InvoiceService = {
  async createInvoiceFromOrder(orderId: string): Promise<Invoice> {
    return fetchWithAuth(`/invoices`, {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  async getAllInvoices(page: number = 1, limit: number = 10, status?: InvoiceStatus): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const data = await fetchWithAuth(`/invoices?${params.toString()}`);
    return {
      data: data.data,
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    };
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    return fetchWithAuth(`/invoices/${id}`);
  },

  async getInvoicePdf(id: string): Promise<any> {
    return fetchWithAuth(`/invoices/${id}/pdf`);
  },
};