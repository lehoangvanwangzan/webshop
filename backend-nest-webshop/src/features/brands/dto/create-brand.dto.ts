import { IsString, IsOptional, IsBoolean, IsNumber, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(120)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sort_order?: number;
}
