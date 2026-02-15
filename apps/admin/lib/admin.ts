import { apiClient } from "./api";
import { User, Company } from "./types";

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CompanyListResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  isSupplier?: boolean;
  isClient?: boolean;
}

export async function getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const query = params.toString();
  const endpoint = `/users${query ? `?${query}` : ''}`;

  return await apiClient.get<UserListResponse>(endpoint);
}

export async function getSuppliers(filters: CompanyFilters = {}): Promise<CompanyListResponse> {
  const params = new URLSearchParams();
  params.append('isSupplier', 'true');

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const query = params.toString();
  const endpoint = `/companies${query ? `?${query}` : ''}`;

  return await apiClient.get<CompanyListResponse>(endpoint);
}
