import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [IndicatorsController],
    providers: [IndicatorsService, PrismaService],
})
export class IndicatorsModule { }
