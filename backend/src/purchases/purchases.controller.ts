import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create({
      supplier: { connect: { id: createPurchaseDto.supplierId } },
      purchaseDate: new Date(createPurchaseDto.purchaseDate),
      subTotalAmount: createPurchaseDto.subTotalAmount,
      totalVatAmount: createPurchaseDto.totalVatAmount,
      grandTotal: createPurchaseDto.grandTotal,
      items: {
        create: createPurchaseDto.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
        })),
      },
    });
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.purchasesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    const { items, supplierId, ...purchaseData } = updatePurchaseDto;
    return this.purchasesService.update(id, {
      ...purchaseData,
      ...(supplierId && { supplier: { connect: { id: supplierId } } }),
      ...(items && { items: { deleteMany: {}, create: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        itemVatAmount: item.itemVatAmount,
        totalPriceWithVat: item.totalPriceWithVat,
      })) } }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
