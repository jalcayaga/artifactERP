import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, IsBoolean } from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateUserDto {
  @IsEmail({}, { message: "Please provide a valid email address." })
  @IsNotEmpty({ message: "Email should not be empty." })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Password should not be empty." })
  @MinLength(6, { message: "Password must be at least 6 characters long." })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "First name should not be empty if provided." })
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Last name should not be empty if provided." })
  lastName?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Invalid role specified. Valid roles are ${Object.values(UserRole).join(", ")}.`,
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
