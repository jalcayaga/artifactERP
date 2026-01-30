import { api } from '../api'
import { DashboardStats } from '../types'

export const DashboardService = {
  async getStats(companyId: string): Promise<DashboardStats> {
    try {
      const response = await api.get('/dashboard', {
        params: { companyId },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },
}
