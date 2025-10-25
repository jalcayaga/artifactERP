import { IsString, IsBoolean, IsOptional, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsRut } from '../../common/validators/is-rut.validator';
import { CreateContactPersonDto } from '../../contact-people/dto/create-contact-person.dto';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  fantasyName?: string;

  @IsNotEmpty()
  @IsString()
  @IsRut()
  rut: string;

  @IsOptional()
  @IsString()
  giro?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  isClient?: boolean;

  @IsBoolean()
  @IsOptional()
  isSupplier?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateContactPersonDto)
  contactPerson?: CreateContactPersonDto;
}