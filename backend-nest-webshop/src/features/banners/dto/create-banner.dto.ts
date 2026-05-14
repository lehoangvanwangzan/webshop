import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsIn, Min } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link_url?: string;

  @IsOptional()
  @IsString()
  @IsIn(['homepage', 'sidebar', 'category', 'footer'])
  position?: string = 'homepage';

  @IsOptional()
  @IsNumber()
  @Min(0)
  sort_order?: number = 0;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
