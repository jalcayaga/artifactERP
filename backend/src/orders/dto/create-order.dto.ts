
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested, IsInt, Min, IsOptional, IsNumber, IsObject, MaxLength } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  // Price is usually taken from the product on the backend to prevent tampering,
  // but frontend might send it for display or if dynamic pricing per item is allowed.
  // For now, backend will fetch product price.
}

// Simplified Address DTO for now
export class AddressDto {
    @IsString() @IsNotEmpty() @MaxLength(100) name: string;
    @IsString() @IsNotEmpty() @MaxLength(255) address1: string;
    @IsOptional() @IsString() @MaxLength(255) address2?: string;
    @IsString() @IsNotEmpty() @MaxLength(100) city: string;
    @IsString() @IsNotEmpty() @MaxLength(20) postalCode: string;
    @IsString() @IsNotEmpty() @MaxLength(50) country: string; // e.g., "Chile"
    @IsOptional() @IsString() @MaxLength(20) phone?: string;
}


export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto; // Or JsonObject if not using specific DTO

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto; // Or JsonObject

  @IsOptional()
  @IsString()
  customerNotes?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  shippingAmount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  discountAmount?: number;
  
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  vatRatePercent?: number; // e.g., 19.0 for 19%. If not provided, a default will be used.

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string; // e.g., CLP, USD. Defaults to CLP if not provided.
}