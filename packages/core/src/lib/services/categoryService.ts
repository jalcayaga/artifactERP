import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'
import { api } from '../api'

export const CategoryService = {
    // Fetch all categories
    async getAllCategories(token: string) {
        const response = await api.get('/categories', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Get single category
    async getCategoryById(id: string, token: string): Promise<Category> {
        const response = await api.get(`/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Create category
    async createCategory(
        data: CreateCategoryDto,
        token: string
    ): Promise<Category> {
        const response = await api.post('/categories', data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Update category
    async updateCategory(
        id: string,
        data: UpdateCategoryDto,
        token: string
    ): Promise<Category> {
        const response = await api.patch(`/categories/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
    },

    // Delete category
    async deleteCategory(id: string, token: string): Promise<void> {
        await api.delete(`/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
}
