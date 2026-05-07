import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Category } from '../types/categories.types';

export const categoriesApi = {
  findAllTree: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
  findOne: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data;
  },
};
