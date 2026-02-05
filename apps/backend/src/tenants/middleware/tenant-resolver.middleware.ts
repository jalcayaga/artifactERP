import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TenantsService } from '../tenants.service'
import { ConfigService } from '@nestjs/config'
import { TenantNotFoundException } from '../../common/exceptions/tenant-not-found.exception'

interface TenantAwareRequest extends Request {
  tenantId?: string
  tenantSlug?: string
}

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly configService: ConfigService
  ) { }

  async use(
    req: TenantAwareRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const headerKey = (
      this.configService.get<string>('multiTenant.headerKey') || 'x-tenant-slug'
    ).toLowerCase()
    const defaultSlug =
      this.configService.get<string>('multiTenant.defaultTenantSlug') ||
      'artifact'
    const rootDomain = this.configService.get<string>('multiTenant.rootDomain')

    let resolvedSlug: string | undefined = this.extractFromHeader(
      req,
      headerKey
    )

    let tenant: (any & { branding: any | null }) | null = null;

    if (resolvedSlug) {
      // Mapping specific for storefront and marketing
      if (resolvedSlug === 'store' || resolvedSlug === 'www') {
        resolvedSlug = 'artifact';
      }

      try {
        tenant = await this.tenantsService.findBySlug(resolvedSlug)
      } catch (error) {
        console.warn(`Tenant not found for slug: ${resolvedSlug}, falling back to default resolution.`);
      }
    }

    if (!tenant) {
      const hostname = req.hostname.toLowerCase().split(':')[0];
      const isPlatformSubdomain = rootDomain && hostname.endsWith(rootDomain) && hostname !== rootDomain;

      if (isPlatformSubdomain) {
        const slug = hostname.replace(`.${rootDomain}`, '');
        tenant = await this.tenantsService.findBySlug(slug);
      } else {
        // Try searching by custom domain
        try {
          tenant = await this.tenantsService.findByDomain(hostname);
        } catch (error) {
          // Ignore domain not found to allow fallback to defaultSlug
        }
      }
    }

    // Default to artifact if still nothing
    if (!tenant) {
      tenant = await this.tenantsService.findBySlug(defaultSlug);
    }

    if (!tenant) {
      throw new UnauthorizedException(
        'Tenant could not be resolved from request'
      )
    }

    ; (req as any).tenant = tenant
    req.tenantId = tenant.id
    req.tenantSlug = tenant.slug
    next()
  }

  private extractFromHeader(
    req: Request,
    headerKey: string
  ): string | undefined {
    const headerValue = req.headers[headerKey]
    if (!headerValue) {
      return undefined
    }
    if (Array.isArray(headerValue)) {
      return headerValue[0]?.toString()
    }
    return headerValue.toString()
  }

  private extractFromHostname(
    hostname: string | undefined,
    rootDomain?: string
  ): string | undefined {
    if (!hostname) {
      return undefined
    }

    const normalizedHost = hostname.toLowerCase().split(':')[0]

    if (rootDomain && normalizedHost.endsWith(rootDomain)) {
      const candidate = normalizedHost.replace(`.${rootDomain}`, '')
      if (candidate && candidate !== rootDomain) {
        return candidate
      }
      return rootDomain.split('.')[0]
    }

    if (normalizedHost.includes('.')) {
      return normalizedHost.split('.')[0]
    }

    return undefined
  }
}
