import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantsController } from './tenants.controller';
import { TenantResolverMiddleware } from './middleware/tenant-resolver.middleware';

@Module({
  imports: [PrismaModule],
  providers: [TenantsService, TenantResolverMiddleware],
  exports: [TenantsService, TenantResolverMiddleware],
  controllers: [TenantsController],
})
export class TenantsModule {}
