import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '@features/users/entities/user.entity';
import { Product } from '@features/products/entities/product.entity';

export interface DashboardStats {
  total_users: number;           // Tổng số người dùng
  user_change_pct: number;       // % thay đổi người dùng
  user_change_up: boolean;       // Tăng hay giảm
  total_active_products: number; // Tổng sản phẩm đang bán (active=1)
  product_change_pct: number;    // % thay đổi sản phẩm đang bán
  product_change_up: boolean;    // Tăng hay giảm
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    // Lấy tổng số lượng đồng thời
    const [total_users, total_active_products] = await Promise.all([
      this.userRepo.count(),
      this.productRepo.count({ where: { is_active: 1 } }),
    ]);

    // Khoảng thời gian hôm nay (00:00:00 → 23:59:59)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Khoảng thời gian hôm qua
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    // Thống kê số lượng mới của hôm nay và hôm qua
    const [
      todayUsers, yesterdayUsers,
      todayProducts, yesterdayProducts
    ] = await Promise.all([
      this.userRepo.count({ where: { created_at: Between(todayStart, todayEnd) } }),
      this.userRepo.count({ where: { created_at: Between(yesterdayStart, yesterdayEnd) } }),
      this.productRepo.count({ where: { is_active: 1, created_at: Between(todayStart, todayEnd) } }),
      this.productRepo.count({ where: { is_active: 1, created_at: Between(yesterdayStart, yesterdayEnd) } }),
    ]);

    /**
     * Tính toán phần trăm thay đổi
     * (Hôm nay / Hôm qua) * 100
     */
    const calculateChange = (today: number, yesterday: number) => {
      let pct: number;
      if (yesterday > 0) {
        pct = Math.round((today / yesterday) * 1000) / 10;
      } else {
        pct = today > 0 ? 100 : 0; // Mặc định 100% nếu hôm qua không có dữ liệu
      }
      return { pct, up: today >= yesterday };
    };

    const userStats = calculateChange(todayUsers, yesterdayUsers);
    const productStats = calculateChange(todayProducts, yesterdayProducts);

    return {
      total_users,
      user_change_pct: userStats.pct,
      user_change_up: userStats.up,
      total_active_products,
      product_change_pct: productStats.pct,
      product_change_up: productStats.up,
    };
  }
}
