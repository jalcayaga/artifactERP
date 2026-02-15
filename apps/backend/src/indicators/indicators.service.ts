import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { IndicatorType } from '@prisma/client';

@Injectable()
export class IndicatorsService {
    private readonly logger = new Logger(IndicatorsService.name);
    private readonly apiUrl = 'https://mindicador.cl/api';

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.debug('Fetching economic indicators...');
        await this.fetchAndSaveIndicators();
    }

    async fetchAndSaveIndicators() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch indicators: ${response.statusText}`);
            }
            const data = await response.json();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const indicatorsToSave = [
                { type: IndicatorType.UF, key: 'uf' },
                { type: IndicatorType.USD, key: 'dolar' },
                { type: IndicatorType.UTM, key: 'utm' },
            ];

            for (const ind of indicatorsToSave) {
                if (data[ind.key]) {
                    const value = data[ind.key].valor;
                    await this.prisma.economicIndicator.upsert({
                        where: {
                            indicator_date: {
                                indicator: ind.type,
                                date: today,
                            }
                        },
                        update: {
                            value: value,
                            source: 'mindicador.cl',
                        },
                        create: {
                            indicator: ind.type,
                            date: today,
                            value: value,
                            source: 'mindicador.cl',
                        }
                    });
                    this.logger.log(`Updated ${ind.type}: ${value}`);
                }
            }
            return { success: true, message: 'Indicators updated successfully' };
        } catch (error) {
            this.logger.error('Error updating indicators', error);
            return { success: false, error: error.message };
        }
    }

    async getLatestIndicators() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prisma.economicIndicator.findMany({
            where: {
                date: today
            }
        });
    }
}
