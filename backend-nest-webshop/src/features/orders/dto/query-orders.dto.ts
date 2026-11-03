import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ORDER_STATUSES } from '../orders.constants';
import type { OrderStatus } from '../entities/order.entity';

export class QueryOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

  /** Admin: tìm theo mã đơn, tên / SĐT người nhận, email khách */
  @IsOptional()
  @IsString()
  search?: string;
}
