import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchDto } from './create-dispatch.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DispatchStatus } from '@prisma/client';

export class UpdateDispatchDto extends PartialType(CreateDispatchDto) {
    @IsEnum(DispatchStatus)
    @IsOptional()
    status?: DispatchStatus;
}
