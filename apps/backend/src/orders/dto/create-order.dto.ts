import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'
import { OrderStatus, PaymentStatus, PaymentMethod, OrderSource } from '@prisma/client'

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string

  @IsNumber()
  quantity: number

  @IsNumber()
  unitPrice: number

  @IsNumber()
  totalPrice: number

  @IsNumber()
  itemVatAmount: number

  @IsNumber()
  totalPriceWithVat: number

  @IsOptional()
  @IsArray()
  lots?: { lotId: string; quantity: number }[]
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  companyId: string

  @IsOptional()
  @IsString()
  source?: OrderSource

  @IsOptional()
  @IsString()
  status?: OrderStatus

  @IsOptional()
  @IsString()
  paymentStatus?: PaymentStatus

  @IsNumber()
  subTotalAmount: number

  @IsNumber()
  vatAmount: number

  @IsNumber()
  grandTotalAmount: number

  @IsOptional()
  @IsNumber()
  vatRatePercent?: number

  @IsOptional()
  @IsNumber()
  discountAmount?: number

  @IsOptional()
  @IsNumber()
  shippingAmount?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsString()
  shippingAddress?: string

  @IsOptional()
  @IsString()
  billingAddress?: string

  @IsOptional()
  @IsString()
  customerNotes?: string

  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethod

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
