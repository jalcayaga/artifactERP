
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client'; // Import UserRole enum

// Frontend UserRole values are 'Admin', 'Editor', 'Visor'
// Prisma UserRole enum keys are 'ADMIN', 'EDITOR', 'VIEWER'
// The DTO receives the string from frontend, validation ensures it's one of the expected strings.
// The service layer is responsible for mapping this string to Prisma's UserRole enum type.
const validFrontendRoles = ['Admin', 'Editor', 'Visor']; // For IsEnum validation based on frontend values
const prismaUserRoleKeys = Object.keys(UserRole); // Use UserRole directly

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'First name should not be empty if provided.' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name should not be empty if provided.' })
  lastName?: string;

  @IsOptional()
  @IsEnum(validFrontendRoles, { 
    message: `Invalid role specified. Valid roles are ${validFrontendRoles.join(', ')}.` 
  })
  role?: string;
}