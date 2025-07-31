import fetchWithAuth from './api';
import { Quote, CreateQuoteDto, UpdateQuoteDto } from '@/lib/types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const QuoteService = {
  async getAllQuotes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Quote>> {
    const data = await fetchWithAuth(`/quotes?page=${page}&limit=${limit}`);
    return {
      data: data.data,
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    };
  },

  async getQuoteById(id: string): Promise<Quote> {
    return fetchWithAuth(`/quotes/${id}`);
  },

  async createQuote(quoteData: CreateQuoteDto): Promise<Quote> {
    return fetchWithAuth(`/quotes`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  async updateQuote(id: string, quoteData: UpdateQuoteDto): Promise<Quote> {
    return fetchWithAuth(`/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(quoteData),
    });
  },

  async deleteQuote(id: string): Promise<void> {
    await fetchWithAuth(`/quotes/${id}`, {
      method: 'DELETE',
    });
  },
};
