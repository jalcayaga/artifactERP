import { api } from '../api'

export const ChannelOfferService = {
    // Fetch all channel offers for a tenant (optionally filtered by channel)
    async getAllOffers(token: string, channel?: string) {
        const response = await api.get('/channel-offers', {
            params: { channel },
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Fetch a single offer
    async getOfferById(id: string, token: string) {
        const response = await api.get(`/channel-offers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Create a new channel offer
    async createOffer(data: any, token: string) {
        const response = await api.post('/channel-offers', data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Update an existing channel offer
    async updateOffer(id: string, data: any, token: string) {
        const response = await api.patch(`/channel-offers/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Delete a channel offer
    async deleteOffer(id: string, token: string) {
        await api.delete(`/channel-offers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
}
