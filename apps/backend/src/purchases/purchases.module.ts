import { Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ProductsModule } from '../products/products.module'
import { CompaniesModule } from '../companies/companies.module'

@Module({
  imports: [PrismaModule, ProductsModule, CompaniesModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
