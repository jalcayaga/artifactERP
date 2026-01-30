import { Module } from '@nestjs/common'
import { DteService } from './dte.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [DteService],
  exports: [DteService],
})
export class DteModule { }
