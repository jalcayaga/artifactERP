import { fetchWithAuth } from '@artifact/core/client';;

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: { permission: Permission }[];
}

interface Permission {
  id: string;
  name: string;
  action: string;
  subject: string;
  description?: string;
}

interface CreateRoleDto {
  name: string;
  permissionIds?: string[];
}

interface UpdateRoleDto {
  name?: string;
  permissionIds?: string[];
}

interface CreatePermissionDto {
  name: string;
  action: string;
  subject: string;
  description?: string;
}

interface UpdatePermissionDto {
  name?: string;
  action?: string;
  subject?: string;
  description?: string;
}

// Roles Service
export const rolesService = {
  getAll: async (): Promise<Role[]> => {
    return fetchWithAuth('/roles') as Promise<Role[]>;
  },

  getById: async (id: string): Promise<Role> => {
    return fetchWithAuth(`/roles/${id}`) as Promise<Role>;
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    return fetchWithAuth(`/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Role>;
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Role>;
  },

  remove: async (id: string): Promise<void> => {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'DELETE',
    }) as Promise<void>;
  },
};

// Permissions Service
export const permissionsService = {
  getAll: async (): Promise<Permission[]> => {
    return fetchWithAuth('/permissions') as Promise<Permission[]>;
  },

  getById: async (id: string): Promise<Permission> => {
    return fetchWithAuth(`/permissions/${id}`) as Promise<Permission>;
  },

  create: async (data: CreatePermissionDto): Promise<Permission> => {
    return fetchWithAuth(`/permissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<Permission>;
  },

  update: async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
    return fetchWithAuth(`/permissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<Permission>;
  },

  remove: async (id: string): Promise<void> => {
    return fetchWithAuth(`/permissions/${id}`, {
      method: 'DELETE',
    }) as Promise<void>;
  },
};
