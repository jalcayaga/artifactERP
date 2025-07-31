import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('CL') // Assuming Chilean phone numbers
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
