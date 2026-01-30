import {
  IsString,
  IsInt,
  IsDecimal,
  IsOptional,
  IsDateString,
} from 'class-validator'

export class CreateLotDto {
  @IsString()
  productId: string

  @IsString()
  lotNumber: string

  @IsInt()
  initialQuantity: number

  @IsInt()
  currentQuantity: number

  @IsDecimal()
  purchasePrice: number

  @IsDateString()
  entryDate: string

  @IsOptional()
  @IsDateString()
  expirationDate?: string

  @IsOptional()
  @IsString()
  location?: string
}
