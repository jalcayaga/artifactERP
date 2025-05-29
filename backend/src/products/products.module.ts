
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
// PrismaModule is global, so PrismaService is available

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Export service if needed by other modules (e.g., OrdersModule)
})
export class ProductsModule {}
