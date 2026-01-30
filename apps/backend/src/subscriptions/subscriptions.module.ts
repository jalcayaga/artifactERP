import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionCronService } from './subscription-cron.service';

@Module({
    imports: [
        PrismaModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionCronService],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }
