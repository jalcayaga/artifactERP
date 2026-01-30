import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator'

export class CreateContactPersonDto {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  role?: string
}
