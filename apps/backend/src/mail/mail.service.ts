import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) { }

    async sendDteEmail(
        to: string,
        subject: string,
        body: string,
        attachments: Array<{ filename: string, content: Buffer }>
    ) {
        this.logger.log(`[Mock Mail] Sending email to ${to}`);
        this.logger.log(`[Mock Mail] Subject: ${subject}`);
        this.logger.log(`[Mock Mail] Attachments: ${attachments.length}`);

        // TODO: Integrate actual mail provider (Resend, SendGrid, Nodemailer)
        // For now, valid simulation is enough as per constraints (no new packages installable easily)

        return { success: true, message: 'Email queued (mock)' };
    }
}
