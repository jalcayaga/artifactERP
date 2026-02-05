export interface TenantBranding {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    lightTheme?: any;
    homeSections?: any;
    socialLinks?: any;
}

export interface TenantPublicConfig {
    slug: string;
    name: string;
    displayName: string;
    branding: TenantBranding | null;
}

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.artifact.cl';

export async function getTenantConfig(host: string | null): Promise<TenantPublicConfig | null> {
    try {
        const url = host
            ? `${BACKEND_URL}/tenants/public/resolve?host=${host.split(':')[0]}`
            : `${BACKEND_URL}/tenants/public/artifact`;

        const res = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error fetching tenant config:", error);
        return null;
    }
}
