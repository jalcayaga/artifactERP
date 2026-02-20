import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { DteService } from './dte.service';

@Injectable()
export class DteCronService {
    private readonly logger = new Logger(DteCronService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly dteService: DteService
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleDteStatusCheck() {
        this.logger.log('Running DTE status check cron job...');

        // Find invoices that are SENT but not yet ACCEPTED or REJECTED
        // We limit to a reasonable number to avoid overwhelming SII or our server
        const pendingInvoices = await this.prisma.invoice.findMany({
            where: {
                dteStatus: 'SENT',
                dteTrackId: { not: null }
            },
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        if (pendingInvoices.length === 0) {
            this.logger.log('No pending DTEs to check.');
            return;
        }

        this.logger.log(`Found ${pendingInvoices.length} pending DTEs. checking status...`);

        for (const invoice of pendingInvoices) {
            try {
                this.logger.debug(`Checking status for Invoice ${invoice.id} (TrackID: ${invoice.dteTrackId})...`);

                await this.dteService.checkSubmissionStatus(invoice.tenantId, invoice.id);

                // Add a small delay to be nice to SII
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                this.logger.error(`Failed to check status for Invoice ${invoice.id}: ${error.message}`, error.stack);
            }
        }

        this.logger.log('DTE status check completed.');
    }
}
