import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DteModule } from '../dte/dte.module';

@Module({
  imports: [PrismaModule, DteModule],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
