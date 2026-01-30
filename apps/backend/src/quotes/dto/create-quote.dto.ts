import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'
import { QuoteStatus } from '@prisma/client' // Assuming QuoteStatus enum is in Prisma client

export class CreateQuoteItemDto {
  @IsString()
  productId: string

  @IsNumber()
  @Min(1)
  quantity: number

  @IsNumber()
  unitPrice: number

  @IsNumber()
  totalPrice: number

  @IsNumber()
  itemVatAmount: number

  @IsNumber()
  totalPriceWithVat: number
}

export class CreateQuoteDto {
  @IsString()
  companyId: string // Link to Company model

  @IsDateString()
  quoteDate: string

  @IsOptional()
  @IsDateString()
  expiryDate?: string

  @IsOptional()
  @IsString()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus

  @IsNumber()
  vatRatePercent: number

  @IsNumber()
  subTotalAmount: number

  @IsNumber()
  vatAmount: number

  @IsNumber()
  grandTotal: number

  @IsOptional()
  @IsString()
  termsAndConditions?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[]
}
