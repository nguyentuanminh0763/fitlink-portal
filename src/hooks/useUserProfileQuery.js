import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '~/services';
import { useAuth } from '~/contexts/AuthProvider';

export const USER_PROFILE_QUERY_KEY = ['user-profile'];

/**
 * Hook truy vấn thông tin hồ sơ người dùng với TanStack Query
 * - Tự động cache dữ liệu trong 5 phút
 * - Chống spam request, tải tức thì 0ms từ cache
 */
export function useUserProfileQuery(options = {}) {
  const { user: authUser } = useAuth();

  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const data = await userService.getUserProfile();
      return data;
    },
    // Khởi tạo dữ liệu ban đầu từ AuthContext để 0ms loading nếu đã đăng nhập
    initialData: authUser || undefined,
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook cập nhật thông tin hồ sơ người dùng (Mutation)
 * - Tự động cập nhật cache và AuthContext
 * - Đánh dấu stale để tự động đồng bộ
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async ({ profileData, avatarFile }) => {
      return await userService.updateProfile(profileData, avatarFile);
    },
    onSuccess: (response) => {
      if (response?.user) {
        setUser(response.user);
        queryClient.setQueryData(USER_PROFILE_QUERY_KEY, response.user);
      }
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}

/**
 * Hook đổi mật khẩu (Mutation)
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (passwordData) => {
      return await userService.changePassword(passwordData);
    },
  });
}
