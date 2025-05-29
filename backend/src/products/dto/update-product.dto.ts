
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, Min, MaxLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client'; // Changed to import Prisma namespace

// Explicitly defining UpdateProductDto to ensure properties are recognized
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEnum(Prisma.ProductType) // Changed to Prisma.ProductType
  productType?: Prisma.ProductType; // Changed to Prisma.ProductType

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderLevel?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
