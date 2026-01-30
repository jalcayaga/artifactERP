import { Module } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CompaniesController } from './companies.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService],
  exports: [CompaniesService], // Export CompaniesService if it needs to be used by other modules
})
export class CompaniesModule {}
