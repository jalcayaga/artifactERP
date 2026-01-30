import fetchWithAuth from '../fetchWithAuth'
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from '../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export const PurchaseService = {
  async getAllPurchases(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Purchase>> {
    const data = await fetchWithAuth(`/purchases?page=${page}&limit=${limit}`)
    return {
      data: data.data, // Assuming the API returns { data: [], total: ..., pages: ... }
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    }
  },

  async getPurchaseById(id: string): Promise<Purchase> {
    return fetchWithAuth(`/purchases/${id}`)
  },

  async createPurchase(purchaseData: CreatePurchaseDto): Promise<Purchase> {
    return fetchWithAuth(`/purchases`, {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    })
  },

  async updatePurchase(
    id: string,
    purchaseData: UpdatePurchaseDto
  ): Promise<Purchase> {
    return fetchWithAuth(`/purchases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(purchaseData),
    })
  },

  async deletePurchase(id: string): Promise<void> {
    await fetchWithAuth(`/purchases/${id}`, {
      method: 'DELETE',
    })
  },
}
