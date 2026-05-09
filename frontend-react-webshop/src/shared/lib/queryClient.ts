import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 phút — dữ liệu không bị coi là stale trong 5 phút
      refetchOnWindowFocus: false, // không tự fetch lại khi focus cửa sổ
      retry: 1,
    },
  },
});
