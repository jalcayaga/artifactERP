import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
  IsInt,
  ArrayMinSize,
  IsEnum,
  IsPositive,
} from 'class-validator'
import { Type } from 'class-transformer'
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client'

export class SaleItemDto {
  @IsString({ message: 'Product ID is required' })
  @IsNotEmpty({ message: 'Product ID should not be empty' })
  productId: string

  @IsNumber()
  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be positive' })
  quantity: number

  @IsNumber()
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number

  @IsNumber()
  @Min(0, { message: 'Total price cannot be negative' })
  totalPrice: number

  @IsNumber()
  @Min(0, { message: 'VAT amount cannot be negative' })
  itemVatAmount: number

  @IsNumber()
  @Min(0, { message: 'Total price with VAT cannot be negative' })
  totalPriceWithVat: number
}

export class CreateSaleDto {
  @IsString({ message: 'User ID is required' })
  @IsNotEmpty({ message: 'User ID should not be empty' })
  userId: string

  @IsString({ message: 'Company ID is required' })
  @IsNotEmpty({ message: 'Company ID should not be empty' })
  companyId: string

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  paymentStatus?: PaymentStatus

  @IsNumber()
  @Min(0, { message: 'Subtotal cannot be negative' })
  subTotalAmount: number

  @IsNumber()
  @Min(0, { message: 'VAT amount cannot be negative' })
  vatAmount: number

  @IsNumber()
  @Min(0, { message: 'Grand total cannot be negative' })
  grandTotalAmount: number

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'VAT rate cannot be negative' })
  vatRatePercent?: number

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Discount amount cannot be negative' })
  discountAmount?: number

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Shipping amount cannot be negative' })
  shippingAmount?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsString()
  customerNotes?: string

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod?: PaymentMethod

  @IsOptional()
  @IsString()
  shippingAddress?: string

  @IsOptional()
  @IsString()
  billingAddress?: string

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[]

  @IsOptional()
  @IsString()
  posShiftId?: string
}
