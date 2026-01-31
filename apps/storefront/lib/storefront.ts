/**
 * Servicios para consumir los endpoints del Storefront API
 */

import { apiClient } from './api';

export interface TenantTheme {
  tenant: {
    slug: string;
    name: string;
  };
  branding: {
    logoUrl?: string;
    secondaryLogoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    lightTheme?: Record<string, unknown>;
    darkTheme?: Record<string, unknown>;
    socialLinks?: Record<string, unknown>;
  } | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  unitPrice?: number;
  category?: string;
  sku?: string;
  // Mapped fields required by frontend components
  handle: string;
  thumbnail: string;
  currency: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  message?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  tenantSlug?: string;
}

/**
 * Helper to map backend product to frontend structure
 */
function mapProduct(p: any): Product {
  return {
    ...p,
    handle: p.id,
    thumbnail: p.images && p.images.length > 0 ? p.images[0] : '/placeholder.png',
    currency: 'CLP',
    price: Number(p.price)
  };
}

/**
 * Obtiene el tema y branding del tenant actual
 */
export async function getTenantTheme(host: string): Promise<TenantTheme | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/tenants/public/resolve?host=${host.split(':')[0]}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;
    const config = await res.json();

    return {
      tenant: {
        slug: config.slug,
        name: config.displayName,
      },
      branding: config.branding,
    };
  } catch (error) {
    console.error('Error obteniendo tema del tenant:', error);
    return null;
  }
}

/**
 * Lista productos publicados con filtros opcionales
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductListResponse> {
  const { tenantSlug, ...searchFilters } = filters;
  const params = new URLSearchParams();

  if (searchFilters.page) params.append('page', searchFilters.page.toString());
  if (searchFilters.limit) params.append('limit', searchFilters.limit.toString());
  if (searchFilters.category) params.append('category', searchFilters.category);
  if (searchFilters.search) params.append('search', searchFilters.search);
  if (searchFilters.minPrice) params.append('minPrice', searchFilters.minPrice.toString());
  if (searchFilters.maxPrice) params.append('maxPrice', searchFilters.maxPrice.toString());

  const query = params.toString();
  const endpoint = `/storefront/products${query ? `?${query}` : ''}`;

  const headers = tenantSlug ? { 'x-tenant-slug': tenantSlug } : undefined;

  const res = await apiClient.get<any>(endpoint, headers);

  // Handle empty or error response gracefully
  if (!res || !res.data) {
    return { data: [], total: 0, page: 1, limit: 10, pages: 0 };
  }

  // Map items
  const mappedData = Array.isArray(res.data) ? res.data.map(mapProduct) : [];

  return {
    ...res,
    data: mappedData
  };
}

/**
 * Obtiene un producto específico por ID
 */
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const p = await apiClient.get<any>(`/storefront/products/${productId}`);
    if (!p) return null;
    return mapProduct(p);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
}

