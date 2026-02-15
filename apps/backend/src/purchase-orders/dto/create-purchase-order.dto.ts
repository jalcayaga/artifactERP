import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, ValidateNested, Min, IsArray, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePurchaseOrderItemDto {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    @Min(1)
    quantity: number

    @IsNumber()
    @Min(0)
    unitPrice: number
}

export class CreatePurchaseOrderDto {
    @IsString()
    @IsNotEmpty()
    companyId: string

    @IsString()
    @IsNotEmpty()
    orderNumber: string

    @IsDateString()
    @IsOptional()
    issueDate?: string

    @IsDateString()
    @IsOptional()
    deliveryDate?: string

    @IsString()
    @IsOptional()
    notes?: string

    @IsString()
    @IsOptional()
    currency?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderItemDto)
    items: CreatePurchaseOrderItemDto[]
}
