import axios from 'axios';
import { DashboardStats } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const DashboardService = {
  async getStats(token: string): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};
