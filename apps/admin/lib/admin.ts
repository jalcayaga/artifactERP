import { apiClient } from "./api";
import { User } from "./types";

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

export async function getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const query = params.toString();
  const endpoint = `/users${query ? `?${query}` : ''}`;

  return await apiClient.get<UserListResponse>(endpoint);
}
