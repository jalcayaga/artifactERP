
import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [PrismaModule, ProductsModule, ConfigModule],
    providers: [AutomationService],
    controllers: [AutomationController],
})
export class AutomationModule { }
