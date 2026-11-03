import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { User } from '@features/users/entities/user.entity';

type AuthRequest = { user: User };

/** Đơn hàng của user đang đăng nhập */
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('checkout-preview')
  checkoutPreview(@Request() req: AuthRequest) {
    return this.ordersService.getCheckoutPreview(req.user);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user, dto);
  }

  @Get()
  findAll(@Request() req: AuthRequest, @Query() query: QueryOrdersDto) {
    return this.ordersService.findAllForCustomer(req.user.id, query);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneForCustomer(req.user.id, id);
  }

  @Patch(':id/cancel')
  cancel(@Request() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelByCustomer(req.user.id, id);
  }
}
