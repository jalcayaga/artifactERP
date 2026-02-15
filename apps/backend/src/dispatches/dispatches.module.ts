import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DispatchesService } from './dispatches.service';
import { DispatchesController } from './dispatches.controller';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [ProductsModule, PrismaModule], // Import ProductsModule and PrismaModule
    controllers: [DispatchesController],
    providers: [DispatchesService],
    exports: [DispatchesService],
})
export class DispatchesModule { }
