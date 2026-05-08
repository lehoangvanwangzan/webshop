import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { AuthUser, LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export const authApi = {
  login(dto: LoginDto) {
    return apiClient
      .post<ApiResponse<AuthResponse>>('/auth/login', dto)
      .then((res) => res.data.data);
  },

  register(dto: Omit<RegisterDto, 'confirm_password'>) {
    return apiClient
      .post<ApiResponse<AuthResponse>>('/auth/register', dto)
      .then((res) => res.data.data);
  },

  me() {
    return apiClient
      .get<ApiResponse<AuthUser>>('/auth/me')
      .then((res) => res.data.data);
  },

  logout() {
    return apiClient.post('/auth/logout');
  },
};
