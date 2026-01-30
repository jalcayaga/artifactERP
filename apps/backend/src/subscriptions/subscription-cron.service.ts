import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionCronService {
    private readonly logger = new Logger(SubscriptionCronService.name);

    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.debug('Running subscription renewal cron job...');
        await this.subscriptionsService.processRenewals();
    }
}
