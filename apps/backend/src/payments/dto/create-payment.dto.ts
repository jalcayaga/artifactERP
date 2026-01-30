import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator'
import { PaymentMethod } from '@prisma/client'

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string

  @IsNumber()
  amount: number

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}
