import { IsString, IsInt, IsDecimal, Min } from 'class-validator'

export class CreateSaleItemDto {
  @IsString()
  productId: string

  @IsInt()
  @Min(1)
  quantity: number

  @IsDecimal({ decimal_digits: '1,2' })
  unitPrice: string // Use string for Decimal type from Prisma

  @IsDecimal({ decimal_digits: '1,2' })
  totalPrice: string

  @IsDecimal({ decimal_digits: '1,2' })
  itemVatAmount: string

  @IsDecimal({ decimal_digits: '1,2' })
  totalPriceWithVat: string
}
