import { PartialType } from '@nestjs/mapped-types';
import { CreateQuoteDto } from './create-quote.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { QuoteStatus } from '@prisma/client';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
  @IsOptional()
  @IsString()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;
}
