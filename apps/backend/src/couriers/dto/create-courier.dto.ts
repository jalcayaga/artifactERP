import { IsString, IsOptional, IsBoolean, IsEmail, IsUrl } from 'class-validator';

export class CreateCourierDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    contactName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @IsString()
    @IsOptional()
    integrationType?: string;

    @IsString()
    @IsOptional()
    apiKey?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
