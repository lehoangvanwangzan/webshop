import { IsOptional, IsBoolean, IsNumber, IsString, Min, IsEnum, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(['admin', 'staff', 'customer'])
  role?: string;

  /** Cột sắp xếp: id | full_name | email | role | is_active | created_at */
  @IsOptional()
  @IsIn(['id', 'full_name', 'email', 'role', 'is_active', 'created_at'])
  sort_by?: string = 'created_at';

  /** Chiều sắp xếp */
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
