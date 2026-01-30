import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Public } from '../common/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { TenantId } from '../common/decorators/tenant.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(tenantId, createProductDto)
  }

  @Post(':id/technical-sheet')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true)
        } else {
          cb(new Error('Only PDF files are allowed!'), false)
        }
      },
    })
  )
  uploadTechnicalSheet(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.productsService.updateTechnicalSheet(
      tenantId,
      id,
      file.filename
    )
  }

  @Delete(':id/technical-sheet')
  deleteTechnicalSheet(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.deleteTechnicalSheet(tenantId, id)
  }

  @Public()
  @Get()
  findAllPaginated(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.productsService.findAllPaginated(tenantId, page, limit)
  }

  @Public()
  @Get('published')
  findPublished(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('searchQuery') searchQuery?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    const parsedMinPrice =
      minPrice !== undefined ? parseFloat(minPrice) : undefined
    const parsedMaxPrice =
      maxPrice !== undefined ? parseFloat(maxPrice) : undefined

    const filters = {
      category,
      searchQuery,
      minPrice:
        parsedMinPrice !== undefined && !isNaN(parsedMinPrice)
          ? parsedMinPrice
          : undefined,
      maxPrice:
        parsedMaxPrice !== undefined && !isNaN(parsedMaxPrice)
          ? parsedMaxPrice
          : undefined,
    }

    return this.productsService.findPublished(tenantId, page, limit, filters)
  }

  @Get('search')
  search(
    @TenantId() tenantId: string,
    @Query('term') term: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.productsService.search(tenantId, term ?? '', page, limit)
  }

  @Public()
  @Get('published/:id')
  findPublishedOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.findOne(tenantId, id)
  }

  @Get('all')
  findAll(@TenantId() tenantId: string) {
    return this.productsService.findAll(tenantId)
  }

  @Get(':id/average-cost')
  getAverageCost(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.getAverageCost(tenantId, id)
  }

  @Public()
  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.findOne(tenantId, id)
  }

  @Get(':id/lots')
  getLotsByProductId(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.getLotsByProductId(tenantId, id)
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(tenantId, id, updateProductDto)
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.remove(tenantId, id)
  }
}
