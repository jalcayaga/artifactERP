import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { Action } from '@prisma/client'

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  action: Action // Assuming Action enum from Prisma client

  @IsString()
  @IsNotEmpty()
  subject: string

  @IsOptional()
  @IsString()
  description?: string
}
