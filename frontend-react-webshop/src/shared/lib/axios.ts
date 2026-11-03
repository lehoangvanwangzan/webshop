import axios from 'axios';
import { logger } from './logger';
import { useAuthStore } from '@features/auth/stores/auth.store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    logger.error('API request failed', {
      status,
      url: error.config?.url,
      method: error.config?.method,
    });
    if (status === 401) {
      // Xoá cả store (persist) để các query cần đăng nhập (giỏ hàng...) không gọi lại với token cũ
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
