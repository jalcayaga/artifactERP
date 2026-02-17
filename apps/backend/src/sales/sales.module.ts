import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { SalesController } from './sales.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ProductsModule } from '../products/products.module'
import { CompaniesModule } from '../companies/companies.module'
import { InvoicesModule } from '../invoices/invoices.module'

@Module({
  imports: [PrismaModule, ProductsModule, CompaniesModule, InvoicesModule],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule { }
