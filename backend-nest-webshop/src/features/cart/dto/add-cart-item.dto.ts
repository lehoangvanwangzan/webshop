import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  product_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  quantity: number;
}
