import { IsString, IsNotEmpty, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreatePurchaseItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsNumber()
  itemVatAmount: number;

  @IsNumber()
  totalPriceWithVat: number;
}

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsDateString()
  purchaseDate: string;

  @IsNumber()
  subTotalAmount: number;

  @IsNumber()
  totalVatAmount: number;

  @IsNumber()
  grandTotal: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];
}
