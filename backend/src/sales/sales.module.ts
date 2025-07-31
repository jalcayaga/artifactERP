import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module'; // Import ProductsModule
import { ClientsModule } from '../clients/clients.module'; // Import ClientsModule

@Module({
  imports: [PrismaModule, ProductsModule, ClientsModule], // Add ProductsModule and ClientsModule here
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
