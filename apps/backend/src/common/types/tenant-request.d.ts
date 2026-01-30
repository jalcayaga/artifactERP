import { Tenant, TenantBranding } from '@prisma/client'

declare module 'express-serve-static-core' {
  interface Request {
    tenant?: Tenant & { branding: TenantBranding | null }
    tenantId?: string
    tenantSlug?: string
  }
}
