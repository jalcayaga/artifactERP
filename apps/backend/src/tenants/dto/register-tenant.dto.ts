import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'

export enum PlanType {
    DESPEGA = 'DESPEGA',
    CONSOLIDA = 'CONSOLIDA',
    LIDERA = 'LIDERA',
}

export class RegisterTenantDto {
    @IsString()
    @IsNotEmpty()
    companyName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsOptional()
    @IsString()
    slug?: string

    @IsOptional()
    @IsEnum(PlanType)
    plan?: PlanType
}
