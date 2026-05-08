import apiClient from '@shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type { AdminUser, CreateUserPayload, UpdateUserPayload, UserQueryParams } from '../types/users.types';

/**
 * Chuyển avatar_url tương đối (/picture/user/xxx.jpg)
 * thành URL tuyệt đối (http://localhost:3000/picture/user/xxx.jpg)
 */
export const resolveAvatarUrl = (avatarUrl?: string): string | undefined => {
  if (!avatarUrl) return undefined;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  // Lấy origin từ VITE_API_BASE_URL, fallback về localhost:3000
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api/v1';
  const origin = base.replace(/\/api\/v\d+\/?$/, '');
  return `${origin}${avatarUrl}`;
};

export const usersApi = {
  findAll: async (params?: UserQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>(
      '/users',
      { params },
    );
    return data.data;
  },

  /**
   * Tạo người dùng – multipart/form-data để kèm file avatar
   */
  create: async (payload: CreateUserPayload) => {
    const form = new FormData();
    form.append('full_name', payload.full_name);
    form.append('email', payload.email);
    form.append('password', payload.password);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.role) form.append('role', payload.role);
    if (payload.is_active !== undefined) form.append('is_active', String(payload.is_active));
    if (payload.avatar) form.append('avatar', payload.avatar);

    const { data } = await apiClient.post<ApiResponse<AdminUser>>('/users', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  update: async (id: number, payload: UpdateUserPayload) => {
    const { data } = await apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, payload);
    return data.data;
  },

  /** Cập nhật chỉ avatar – PATCH /users/:id/avatar */
  updateAvatar: async (id: number, file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await apiClient.patch<ApiResponse<{ updated: boolean }>>(
      `/users/${id}/avatar`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data;
  },

  /** Xoá avatar – DELETE /users/:id/avatar */
  removeAvatar: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ updated: boolean }>>(
      `/users/${id}/avatar`,
    );
    return data.data;
  },

  changePassword: async (id: number, new_password: string) => {
    const { data } = await apiClient.patch<ApiResponse<{ success: boolean }>>(
      `/users/${id}/password`,
      { new_password },
    );
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/users/${id}`,
    );
    return data.data;
  },
};
