import { Module } from '@nestjs/common'
import { StorefrontController } from './storefront.controller'
import { ProductsModule } from '../products/products.module'
import { TenantsModule } from '../tenants/tenants.module'

@Module({
  imports: [ProductsModule, TenantsModule],
  controllers: [StorefrontController],
})
export class StorefrontModule {}
