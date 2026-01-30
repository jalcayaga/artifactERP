import fetchWithAuth from '../fetchWithAuth'
import { Quote, CreateQuoteDto, UpdateQuoteDto, QuoteStatus } from '../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export const QuoteService = {
  async getAllQuotes(
    page: number = 1,
    limit: number = 10,
    status?: QuoteStatus // Add optional status parameter
  ): Promise<PaginatedResponse<Quote>> {
    let url = `/quotes?page=${page}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    const data = await fetchWithAuth(url)
    return {
      data: data.data,
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    }
  },

  async getQuoteById(id: string): Promise<Quote> {
    return fetchWithAuth(`/quotes/${id}`)
  },

  async createQuote(quoteData: CreateQuoteDto): Promise<Quote> {
    return fetchWithAuth(`/quotes`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })
  },

  async updateQuote(id: string, quoteData: UpdateQuoteDto): Promise<Quote> {
    return fetchWithAuth(`/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(quoteData),
    })
  },

  async deleteQuote(id: string): Promise<void> {
    await fetchWithAuth(`/quotes/${id}`, {
      method: 'DELETE',
    })
  },
}
