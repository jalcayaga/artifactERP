import { Reception, CreateReceptionDto } from '../types'
import { api } from '../api'

export const ReceptionService = {
    // Fetch all receptions
    async getAllReceptions(token: string) {
        const response = await api.get('/receptions', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Get single reception
    async getReceptionById(id: string, token: string): Promise<Reception> {
        const response = await api.get(`/receptions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Create reception
    async createReception(
        data: CreateReceptionDto,
        token: string
    ): Promise<Reception> {
        const response = await api.post('/receptions', data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Update reception (only allowed fields)
    async updateReception(
        id: string,
        data: { notes?: string; receptionNumber?: string; receptionDate?: string },
        token: string
    ): Promise<Reception> {
        const response = await api.patch(`/receptions/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Delete reception
    async deleteReception(id: string, token: string): Promise<void> {
        await api.delete(`/receptions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
}
