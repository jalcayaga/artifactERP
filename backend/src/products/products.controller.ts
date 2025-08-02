import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post(':id/technical-sheet')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed!'), false);
        }
      },
    }),
  )
  uploadTechnicalSheet(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.updateTechnicalSheet(id, file.filename);
  }

  @Delete(':id/technical-sheet')
  deleteTechnicalSheet(@Param('id') id: string) {
    return this.productsService.deleteTechnicalSheet(id);
  }

  @Public()
  @Get()
  findAllPaginated(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.productsService.findAllPaginated(page, limit);
  }

  @Public()
  @Get('published')
  findPublished(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('category') category?: string) {
    return this.productsService.findPublished(page, limit, category);
  }

  @Public()
  @Get('published/:id')
  findPublishedOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('all')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id/average-cost')
  getAverageCost(@Param('id') id: string) {
    return this.productsService.getAverageCost(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/lots')
  getLotsByProductId(@Param('id') id: string) {
    return this.productsService.getLotsByProductId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
