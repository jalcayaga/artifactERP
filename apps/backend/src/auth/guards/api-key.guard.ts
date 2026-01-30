
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        const validApiKey = this.configService.get<string>('CRON_SECRET_KEY');

        if (!validApiKey) {
            // If no key is configured in env, fail safe.
            return false;
        }

        if (apiKey === validApiKey) {
            return true;
        }

        throw new UnauthorizedException('Invalid API Key');
    }
}
