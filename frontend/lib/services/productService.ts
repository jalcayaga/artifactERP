import { Product, CreateProductDto, UpdateProductDto, Lot } from '@/lib/types';
import { api } from '@/lib/api';

export const ProductService = {
  // Fetch all products with pagination (for admin view)
  async getAllProducts(token: string, page: number = 1, limit: number = 10) {
    const response = await api.get('/products', {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Search products by term
  async searchProducts(token: string, term: string, page: number = 1, limit: number = 10) {
    const response = await api.get('/products/search', {
      params: { term, page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Fetch only published products for the e-commerce view
  async getPublishedProducts(page: number = 1, limit: number = 10, category?: string, searchQuery?: string, minPrice?: number, maxPrice?: number) {
    const response = await api.get('/products/published', {
      params: { page, limit, category, searchQuery, minPrice, maxPrice },
    });
    return response.data;
  },

  // Fetch a single published product by its ID
  async getPublishedProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/published/${id}`);
    return response.data;
  },

  // Fetch lots for a specific product
  async getProductLots(productId: string, token: string): Promise<Lot[]> {
    const response = await api.get(`/products/${productId}/lots`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get average cost for a product
  async getAverageCost(productId: string, token: string): Promise<{ averageCost: number | null }> {
    const response = await api.get(`/products/${productId}/average-cost`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Create a new product
  async createProduct(productData: CreateProductDto, token: string): Promise<Product> {
    const response = await api.post('/products', productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update an existing product
  async updateProduct(id: string, productData: UpdateProductDto, token: string): Promise<Product> {
    const response = await api.patch(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Delete a product
  async deleteProduct(id: string, token: string): Promise<void> {
    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Upload a technical sheet (PDF)
  async uploadTechnicalSheet(productId: string, file: File, token: string): Promise<Product> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Product>(`/products/${productId}/technical-sheet`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Delete a technical sheet
  async deleteTechnicalSheet(productId: string, token: string): Promise<Product> {
    const response = await api.delete<Product>(`/products/${productId}/technical-sheet`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
};