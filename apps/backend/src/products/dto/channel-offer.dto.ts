import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean, IsArray, IsUUID, IsJSON } from 'class-validator'
import { OrderSource } from '@prisma/client'

export class CreateChannelOfferDto {
    @IsEnum(OrderSource)
    channel: OrderSource

    @IsString()
    productId: string

    @IsNumber()
    price: number

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @IsOptional()
    @IsJSON()
    metadata?: any

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowedLotIds?: string[]
}

export class UpdateChannelOfferDto {
    @IsOptional()
    @IsNumber()
    price?: number

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @IsOptional()
    @IsJSON()
    metadata?: any

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowedLotIds?: string[]
}
