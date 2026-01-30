import fetchWithAuth from '../fetchWithAuth'
import {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export const PurchaseOrderService = {
  async getAllPurchaseOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    const data = await fetchWithAuth(
      `/purchase-orders?page=${page}&limit=${limit}`
    )
    return {
      data: data.data,
      total: data.total,
      page: data.currentPage,
      limit: limit,
      pages: data.pages,
    }
  },

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    return fetchWithAuth(`/purchase-orders/${id}`)
  },

  async createPurchaseOrder(
    purchaseOrderData: CreatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    return fetchWithAuth(`/purchase-orders`, {
      method: 'POST',
      body: JSON.stringify(purchaseOrderData),
    })
  },

  async updatePurchaseOrder(
    id: string,
    purchaseOrderData: UpdatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    return fetchWithAuth(`/purchase-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(purchaseOrderData),
    })
  },

  async deletePurchaseOrder(id: string): Promise<void> {
    await fetchWithAuth(`/purchase-orders/${id}`, {
      method: 'DELETE',
    })
  },
}
