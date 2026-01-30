import { Module } from '@nestjs/common'
import { TenantsService } from './tenants.service'
import { PrismaModule } from '../prisma/prisma.module'
import { TenantsController } from './tenants.controller'
import { TenantResolverMiddleware } from './middleware/tenant-resolver.middleware'
import { TenantBrandingController } from './controllers/tenant-branding.controller'

import { PaymentsModule } from '../payments/payments.module'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'

@Module({
  imports: [PrismaModule, PaymentsModule, SubscriptionsModule],
  providers: [TenantsService, TenantResolverMiddleware],
  exports: [TenantsService, TenantResolverMiddleware],
  controllers: [TenantsController, TenantBrandingController],
})
export class TenantsModule { }
