import { Module } from '@nestjs/common'
import { StorefrontController } from './storefront.controller'
import { ProductsModule } from '../products/products.module'
import { TenantsModule } from '../tenants/tenants.module'
import { SalesModule } from '../sales/sales.module'

@Module({
  imports: [ProductsModule, TenantsModule, SalesModule],
  controllers: [StorefrontController],
})
export class StorefrontModule { }
