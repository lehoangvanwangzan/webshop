import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;

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
