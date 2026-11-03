import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Category, ChildCategory, CreateCategoryPayload, UpdateCategoryPayload, CreateChildCategoryPayload, UpdateChildCategoryPayload } from '../types/categories.types';

export const categoriesApi = {
  findAllTree: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
  findAllFlat: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories/flat');
    return data.data;
  },
  findOne: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data;
  },
  create: async (payload: CreateCategoryPayload) => {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload);
    return data.data;
  },
  update: async (id: number, payload: UpdateCategoryPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
    return data.data;
  },
  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/categories/${id}`);
    return data.data;
  },

  // ChildCategory
  findAllChildren: async () => {
    const { data } = await apiClient.get<ApiResponse<ChildCategory[]>>('/categories/children/all');
    return data.data;
  },
  createChild: async (payload: CreateChildCategoryPayload) => {
    const { data } = await apiClient.post<ApiResponse<ChildCategory>>('/categories/children', payload);
    return data.data;
  },
  updateChild: async (id: number, payload: UpdateChildCategoryPayload) => {
    const { data } = await apiClient.patch<ApiResponse<ChildCategory>>(`/categories/children/${id}`, payload);
    return data.data;
  },
  removeChild: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/categories/children/${id}`);
    return data.data;
  },
};
