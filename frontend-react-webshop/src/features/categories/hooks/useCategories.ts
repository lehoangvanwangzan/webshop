import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.findAllTree(),
    staleTime: 10 * 60 * 1000, // 10 phút — dữ liệu ít thay đổi
  });
}
