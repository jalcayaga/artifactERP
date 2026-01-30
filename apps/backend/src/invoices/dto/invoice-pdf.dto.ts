import { IsString, IsNotEmpty } from 'class-validator'

export class InvoicePdfDto {
  @IsString()
  @IsNotEmpty()
  htmlContent: string
}
