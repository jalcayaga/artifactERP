import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Tenant, TenantBranding } from '@prisma/client'

export type RequestTenant = Tenant & { branding: TenantBranding | null }

export const TenantContext = createParamDecorator(
  (data: keyof RequestTenant | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    const tenant = request['tenant'] as RequestTenant | undefined
    if (!tenant) {
      return undefined
    }
    return data ? tenant[data] : tenant
  }
)

export const TenantId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    return (
      (request['tenantId'] as string | undefined) ||
      (request['user'] as any)?.tenantId
    )
  }
)

export const TenantSlug = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
    return (request['tenantSlug'] as string | undefined)?.toLowerCase()
  }
)
