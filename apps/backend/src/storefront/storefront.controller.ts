import { Controller, Get, Param, Query, Body, Post } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { Public } from '../common/decorators/public.decorator'
import { ProductsService } from '../products/products.service'
import { SalesService } from '../sales/sales.service'
import {
  TenantContext,
  TenantId,
  RequestTenant,
} from '../common/decorators/tenant.decorator'
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common'

@ApiTags('storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly salesService: SalesService
  ) { }

  @Public()
  @Post('checkout')
  @ApiOperation({ summary: 'Procesar compra (Guest/User)' })
  async checkout(@TenantId() tenantId: string, @Body() orderData: any) {
    // Basic validation should be added here
    return this.salesService.createGuestSale(tenantId, orderData);
  }

  @Public()
  @Get('theme')
  // ... (rest of the file)
  @ApiOperation({
    summary: 'Obtener tema y branding del tenant',
    description:
      'Devuelve la información de branding y personalización del tenant (público)',
  })
  @ApiResponse({ status: 200, description: 'Tema del tenant' })
  @ApiResponse({
    status: 200,
    description: 'null si no hay tenant',
    schema: { type: 'null' },
  })
  async getTheme(@TenantContext() tenant: RequestTenant | undefined) {
    if (!tenant) {
      return null
    }

    const assetBaseUrl =
      process.env.PUBLIC_ASSET_BASE_URL || 'http://localhost:3001'

    const branding = tenant.branding
      ? {
        ...tenant.branding,
        logoUrl: tenant.branding.logoUrl
          ? assetBaseUrl
            ? `${assetBaseUrl}${tenant.branding.logoUrl}`
            : tenant.branding.logoUrl
          : null,
        secondaryLogoUrl: tenant.branding.secondaryLogoUrl
          ? assetBaseUrl
            ? `${assetBaseUrl}${tenant.branding.secondaryLogoUrl}`
            : tenant.branding.secondaryLogoUrl
          : null,
      }
      : null

    return {
      tenant: {
        slug: tenant.slug,
        name: tenant.displayName,
      },
      branding,
    }
  }

  @Public()
  @Get('products')
  @ApiOperation({
    summary: 'Listar productos publicados',
    description:
      'Obtiene productos publicados con filtros opcionales (categoría, búsqueda, precio)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Productos por página',
    example: 12,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filtrar por categoría',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Búsqueda por texto',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: String,
    description: 'Precio mínimo',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: String,
    description: 'Precio máximo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de productos publicados',
  })
  async getProducts(
    @TenantId() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined

    return this.productsService.findPublished(tenantId, page, limit, {
      category,
      searchQuery: search,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    })
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description: 'Devuelve el detalle de un producto publicado específico',
  })
  @ApiResponse({ status: 200, description: 'Detalle del producto' })
  @ApiResponse({
    status: 200,
    description: 'null si el producto no existe o no está publicado',
    schema: { type: 'null' },
  })
  async getProduct(@TenantId() tenantId: string, @Param('id') id: string) {
    const product = await this.productsService.findOne(tenantId, id)
    if (!product || !product.isPublished) {
      return null
    }
    return product
  }
}
