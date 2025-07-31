
import { HttpException, HttpStatus } from '@nestjs/common';

export class OutOfStockException extends HttpException {
  constructor(productId: string, productName: string, quantityNeeded: number, quantityAvailable: number) {
    super(
      {
        message: `No hay suficiente stock para el producto ${productName}.`,
        productId,
        productName,
        quantityNeeded,
        quantityAvailable,
        errorCode: 'OUT_OF_STOCK',
      },
      HttpStatus.CONFLICT,
    );
  }
}
