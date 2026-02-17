
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class N8nGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        // Use a dedicated env var for n8n or fallback to CRON_SECRET_KEY if undefined
        const n8nSecret = this.configService.get<string>('N8N_SECRET_KEY') ||
            this.configService.get<string>('CRON_SECRET_KEY');

        if (!n8nSecret) {
            return false;
        }

        if (apiKey === n8nSecret) {
            return true;
        }

        throw new UnauthorizedException('Invalid n8n API Key');
    }
}
