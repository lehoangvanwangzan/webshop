import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Brand } from '../types/brands.types';

export const brandsApi = {
  findAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Brand[]>>('/brands');
    return data.data;
  },
  findOne: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Brand>>(`/brands/${slug}`);
    return data.data;
  },
};
