import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút coi là dữ liệu mới (fresh)
      gcTime: 10 * 60 * 1000, // Giữ trong RAM 10 phút (Garbage Collection)
      refetchOnWindowFocus: false, // Không tự động gọi lại API khi chuyển tab trình duyệt
      retry: 1, // Thử lại tối đa 1 lần nếu mạng lỗi
    },
  },
});
