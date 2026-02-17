import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { SocialProvider } from '@prisma/client';

export class CreateSocialMessageDto {
    @IsString()
    externalId: string;

    @IsEnum(SocialProvider)
    platform: SocialProvider;

    @IsString()
    from: string; // phone or handle

    @IsString()
    name: string; // contact name

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    mediaUrl?: string;

    @IsString()
    @IsOptional()
    mediaType?: string;

    @IsObject()
    @IsOptional()
    metadata?: any;
}

export class SocialWebhookDto {
    @IsString()
    event: string;

    @IsString()
    instance: string; // instanceName in social_accounts

    @IsObject()
    data: any;
}
