import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '@features/users/entities/user.entity';

export interface DashboardStats {
  total_users: number;
  user_change_pct: number; // (hôm_nay / hôm_qua) × 100, 0 nếu hôm qua = 0
  user_change_up: boolean;        // true = tăng hoặc bằng, false = giảm
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const total_users = await this.userRepo.count();

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

    const [todayCount, yesterdayCount] = await Promise.all([
      this.userRepo.count({ where: { created_at: Between(todayStart, todayEnd) } }),
      this.userRepo.count({ where: { created_at: Between(yesterdayStart, yesterdayEnd) } }),
    ]);

    // Tỉ lệ: (hôm nay / hôm qua) × 100
    // VD: hôm qua 10, hôm nay 1  → 10%
    //     hôm qua 10, hôm nay 0  → 0%
    //     hôm qua 10, hôm nay 30 → 300%
    let user_change_pct: number;
    let user_change_up: boolean;

    if (yesterdayCount > 0) {
      user_change_pct = Math.round((todayCount / yesterdayCount) * 1000) / 10; // 1 chữ số thập phân
    } else {
      user_change_pct = 0; // hôm qua = 0 → không có cơ sở so sánh → 0%
    }
    user_change_up = todayCount >= yesterdayCount;

    return { total_users, user_change_pct, user_change_up };
  }
}
