import fetchWithAuth from '../fetchWithAuth'
import { Sale, CreateSaleDto, UpdateSaleDto, OrderStatus } from '../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export const SaleService = {
  async getAllSales(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus
  ): Promise<PaginatedResponse<Sale>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (status) {
      params.append('status', status)
    }
    const data = await fetchWithAuth(`/sales?${params.toString()}`)
    return {
      data: data?.data ?? [],
      total: data?.total ?? 0,
      page: data?.currentPage ?? page,
      limit: limit,
      pages: data?.pages ?? 1,
    }
  },

  async getSaleById(id: string): Promise<Sale> {
    return fetchWithAuth(`/sales/${id}`)
  },

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    return fetchWithAuth(`/sales`, {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
  },

  async updateSale(id: string, saleData: UpdateSaleDto): Promise<Sale> {
    return fetchWithAuth(`/sales/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(saleData),
    })
  },

  async deleteSale(id: string): Promise<void> {
    await fetchWithAuth(`/sales/${id}`, {
      method: 'DELETE',
    })
  },
}
