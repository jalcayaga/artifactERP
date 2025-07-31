
import { Controller, Get, Post, Body, Param, Query, Request, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming this is the primary guard
// import { RolesGuard } from '../auth/guards/roles.guard'; // If you have a RolesGuard
// import { Roles } from '../auth/decorators/roles.decorator'; // If you have a Roles decorator
// import { UserRole } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Protect all order routes
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders - Create a new order
  // @Roles(UserRole.CLIENT) // Example: if you want to restrict to CLIENT role specifically
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // req.user should be populated by JwtAuthGuard and contain { userId, email, role }
    const userId = req.user.userId; 
    if (!userId) {
        throw new Error('User ID not found in request. Ensure JWT payload includes userId as sub.');
    }
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  // GET /orders - Get orders for the authenticated user
  // @Roles(UserRole.CLIENT)
  @Get()
  findUserOrders(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
    const userId = req.user.userId;
    return this.ordersService.findUserOrders(userId, page, limit);
  }

  // GET /orders/:id - Get a specific order for the authenticated user
  // @Roles(UserRole.CLIENT)
  @Get(':id')
  findOneUserOrder(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.ordersService.findOneUserOrder(id, userId);
  }
}