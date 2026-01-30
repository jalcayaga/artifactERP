import {
  IsOptional,
  IsString,
  IsArray,
  IsEmail,
  MinLength,
  IsBoolean,
} from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password?: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[]

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  profilePictureUrl?: string | null
}
