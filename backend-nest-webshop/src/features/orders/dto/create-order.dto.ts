import { IsString, IsOptional, IsIn, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateOrderDto {
  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Họ tên người nhận tối thiểu 2 ký tự' })
  @MaxLength(100)
  full_name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/[\s.-]/g, '') : value))
  @Matches(/^(0|\+84)\d{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @Transform(trim)
  @IsString()
  @MinLength(5, { message: 'Địa chỉ quá ngắn' })
  @MaxLength(255)
  address: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  ward?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  district?: string;

  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Vui lòng nhập Tỉnh/Thành phố' })
  @MaxLength(100)
  city: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsIn(['cod'], { message: 'Phương thức thanh toán không hợp lệ' })
  payment_method: string;
}
