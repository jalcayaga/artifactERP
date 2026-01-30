import { PartialType } from '@nestjs/mapped-types'
import { CreateSaleDto, SaleItemDto } from './create-sale.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  override items?: SaleItemDto[]
}
