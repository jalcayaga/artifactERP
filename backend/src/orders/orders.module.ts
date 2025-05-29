
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module'; // Import ProductsModule to use ProductsService

// PrismaModule is global
// AuthModule might be needed if orders are tightly coupled with auth beyond the guard

@Module({
  imports: [ProductsModule], // Make ProductsService available
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
