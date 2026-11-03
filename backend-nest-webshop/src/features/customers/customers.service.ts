import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /** Lấy hồ sơ customer của user, tự tạo nếu chưa có (lần đầu dùng giỏ hàng / đặt hàng). */
  async findOrCreateByUserId(userId: number): Promise<Customer> {
    const existing = await this.customerRepository.findOne({ where: { user_id: userId } });
    if (existing) return existing;

    try {
      return await this.customerRepository.save(this.customerRepository.create({ user_id: userId }));
    } catch (err: any) {
      // 2 request song song cùng tạo → request sau dính unique key, đọc lại bản ghi đã tạo
      if (err?.code === 'ER_DUP_ENTRY') {
        return this.customerRepository.findOneOrFail({ where: { user_id: userId } });
      }
      throw err;
    }
  }
}
