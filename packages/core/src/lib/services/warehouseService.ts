import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '../types'
import { api } from '../api'

export const WarehouseService = {
    // Fetch all warehouses
    async getAllWarehouses(token: string) {
        const response = await api.get('/warehouses', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Get single warehouse
    async getWarehouseById(id: string, token: string): Promise<Warehouse> {
        const response = await api.get(`/warehouses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Create warehouse
    async createWarehouse(
        data: CreateWarehouseDto,
        token: string
    ): Promise<Warehouse> {
        const response = await api.post('/warehouses', data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Update warehouse
    async updateWarehouse(
        id: string,
        data: UpdateWarehouseDto,
        token: string
    ): Promise<Warehouse> {
        const response = await api.patch(`/warehouses/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Delete warehouse
    async deleteWarehouse(id: string, token: string): Promise<void> {
        await api.delete(`/warehouses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
}
