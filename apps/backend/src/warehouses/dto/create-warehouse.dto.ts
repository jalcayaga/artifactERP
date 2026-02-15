import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

export class CreateWarehouseDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    address?: string

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean
}
