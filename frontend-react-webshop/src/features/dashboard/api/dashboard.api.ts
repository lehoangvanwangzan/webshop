import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';

export interface DashboardStats {
  total_users: number;
  user_change_pct: number;
  user_change_up: boolean;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },
};
