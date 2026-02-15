import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsArray, ValidateNested, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateReceptionItemDto {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    @Min(1)
    quantity: number

    @IsDateString()
    @IsOptional()
    expirationDate?: string

    @IsString()
    @IsOptional()
    location?: string
}

export class CreateReceptionDto {
    @IsString()
    @IsNotEmpty()
    warehouseId: string

    @IsString()
    @IsOptional()
    purchaseOrderId?: string

    @IsString()
    @IsOptional()
    receptionNumber?: string

    @IsDateString()
    @IsOptional()
    receptionDate?: string

    @IsString()
    @IsOptional()
    notes?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateReceptionItemDto)
    items: CreateReceptionItemDto[]
}
