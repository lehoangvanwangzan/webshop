import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  MinLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  slug: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount_price?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsNumber()
  category_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brand_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  is_active?: number;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}
