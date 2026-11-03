import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { User } from '@features/users/entities/user.entity';

type AuthRequest = { user: User };

/** Giỏ hàng của user đang đăng nhập — mọi API đều trả về toàn bộ giỏ sau khi thay đổi */
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: AuthRequest) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Request() req: AuthRequest, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Request() req: AuthRequest,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(@Request() req: AuthRequest, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  clear(@Request() req: AuthRequest) {
    return this.cartService.clear(req.user.id);
  }
}
