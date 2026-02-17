import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { ProductsModule } from '../products/products.module' // Import ProductsModule to use ProductsService
import { PrismaModule } from '../prisma/prisma.module'
import { SalesModule } from '../sales/sales.module'

// PrismaModule is global
// AuthModule might be needed if orders are tightly coupled with auth beyond the guard

@Module({
  imports: [ProductsModule, PrismaModule, SalesModule], // Make SalesService available
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule { }
