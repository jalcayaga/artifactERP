import { Module } from '@nestjs/common';
import { DteService } from './dte.service';
import { DteController } from './dte.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SiiService } from './sii/sii.service';

@Module({
  controllers: [DteController],
  providers: [DteService, PrismaService, SiiService],
  exports: [DteService],
})
export class DteModule { }
