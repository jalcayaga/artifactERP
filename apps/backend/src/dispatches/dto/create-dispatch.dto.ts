import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDispatchDto {
    @IsString()
    orderId: string;

    @IsString()
    @IsOptional()
    courierId?: string;

    @IsString()
    @IsOptional()
    trackingNumber?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    originAddress?: string; // Optional override

    @IsString()
    @IsOptional()
    destinationAddress?: string; // Optional override
}

export class CreateDispatchItemDto {
    @IsString()
    orderItemId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
