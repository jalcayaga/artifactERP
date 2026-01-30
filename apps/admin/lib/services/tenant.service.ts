import { apiClient } from '../api';

export interface TenantBranding {
    id: string;
    tenantId: string;
    logoUrl?: string;
    secondaryLogoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    lightTheme?: any;
    darkTheme?: any;
    homeSections?: any;
    socialLinks?: any;
}

export interface TenantConfig {
    id: string;
    slug: string;
    name: string;
    displayName: string;
    branding: TenantBranding | null;
    settings?: any;
}

export class TenantService {
    static async getConfig(): Promise<TenantConfig> {
        return apiClient.get<TenantConfig>('/tenants/config');
    }

    static async updateBranding(data: Partial<TenantBranding>): Promise<void> {
        return apiClient.post('/tenants/branding', data);
    }

    static async updateSettings(data: any): Promise<void> {
        return apiClient.post('/tenants/settings', data);
    }
}
