import { Module } from '@nestjs/common'
import { StorefrontController } from './storefront.controller'
import { ProductsModule } from '../products/products.module'
import { TenantsModule } from '../tenants/tenants.module'
import { SalesModule } from '../sales/sales.module'
import { PaymentsModule } from '../payments/payments.module'

@Module({
  imports: [ProductsModule, TenantsModule, SalesModule, PaymentsModule],
  controllers: [StorefrontController],
})
export class StorefrontModule { }
