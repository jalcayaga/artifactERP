// frontend/lib/services/productService.ts
import api from './apiService';
import axios from 'axios';
import { Product, ProductType, CreateProductDto, UpdateProductDto, LotInfo } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  pages: number;
  currentPage: number;
}

export const ProductService = {
  async getAllProducts(token: string, page: number = 1, limit: number = 10, category?: string, search?: string): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get(`/products`, {
        params: { page, limit, category, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  async getProductById(id: string, token: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}/internal`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async createProduct(productData: CreateProductDto, token: string): Promise<Product> {
    try {
      const response = await api.post(`/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: UpdateProductDto, token: string): Promise<Product> {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Public methods for non-authenticated users (e-commerce frontend)
  async getPublishedProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get(`/products`, {
        params: { page, limit, category, search, minPrice, maxPrice }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching published products:', error);
      throw error;
    }
  },

  async getProductLots(productId: string, token: string): Promise<LotInfo[]> {
    try {
      const response = await api.get(`/products/${productId}/lots`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lots for product ${productId}:`, error);
      throw error;
    }
  },

  async getPublishedProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching published product ${id}:`, error);
      return null; // Return null for not found or other errors
    }
  },
};
