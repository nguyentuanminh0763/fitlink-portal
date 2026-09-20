import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true // 💡 Gửi httpOnly cookie cùng request
});

// Các URL kiểm tra ngầm không cần hiện toast lỗi khi chưa đăng nhập
const SILENT_URLS = ['/auth/me', '/auth/profile', '/auth/user-profile', '/users/me'];

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const message =
      error?.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại.';

    const isSilent = SILENT_URLS.some((u) => url.includes(u));
    if (!isSilent) {
      toast.error(message, { toastId: message });
    }

    // Chỉ redirect khi gặp 401/403 ở các request nghiệp vụ yêu cầu quyền hạn và người dùng đang không ở trang public
    if ((status === 401 || status === 403) && !isSilent) {
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
      const publicPaths = ['/home', '/', '/about', '/news', '/contact', '/list-pt', '/unauthorized'];
      const currentPath = window.location.pathname;

      const isExempt =
        authPaths.some((p) => currentPath.startsWith(p)) ||
        publicPaths.includes(currentPath) ||
        currentPath.startsWith('/trainer/');

      if (!isExempt) {
        sessionStorage.setItem('redirectAfterLogin', currentPath + window.location.search);
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
