import { IsString, IsBoolean, IsOptional, IsEnum, MaxLength } from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEnum(['admin', 'staff', 'customer'])
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
