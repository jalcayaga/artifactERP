import {
  IsOptional,
  IsString,
  IsArray,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsBoolean,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'First name should not be empty if provided.' })
  firstName?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name should not be empty if provided.' })
  lastName?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[]

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
