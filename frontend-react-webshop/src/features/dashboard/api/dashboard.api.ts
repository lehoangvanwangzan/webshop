import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';

export interface DashboardStats {
  total_users: number;           // Tổng số người dùng
  user_change_pct: number;       // % thay đổi người dùng
  user_change_up: boolean;       // Tăng hay giảm
  total_active_products: number; // Tổng sản phẩm đang bán
  product_change_pct: number;    // % thay đổi sản phẩm đang bán
  product_change_up: boolean;    // Tăng hay giảm
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },
};
