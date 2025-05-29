
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../common/decorators/public.decorator'; // For public catalog

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- Admin Endpoints (Protected by global JWT guard by default) ---
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('all') // Endpoint for admin to get all products (published or not)
  findAllInternal() {
    return this.productsService.findAll();
  }

  @Get(':id/internal') // Endpoint for admin to get a specific product
  findOneInternal(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // --- Public E-commerce Catalog Endpoints ---
  @Public()
  @Get() // GET /products - for public catalog
  findAllPublished(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAllPublished(page, limit, category);
  }

  @Public()
  @Get(':id') // GET /products/:id - for public product detail
  findOnePublished(@Param('id') id: string) {
    return this.productsService.findOnePublished(id);
  }
}
