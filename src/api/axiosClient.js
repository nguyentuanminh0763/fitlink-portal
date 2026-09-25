import axios from 'axios';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '~/errors/errorMessages';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true // 💡 Gửi httpOnly cookie cùng request
});

// Các URL kiểm tra ngầm không cần hiện toast lỗi khi chưa đăng nhập
const SILENT_URLS = ['/auth/me', '/auth/profile', '/auth/user-profile', '/users/me'];

// Interceptor quyết định LÀM GÌ khi API lỗi (toast, chuyển trang 401/403);
// câu thông báo NÓI GÌ lấy từ ~/errors/errorMessages.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const message = getApiErrorMessage(error);

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
        if (status === 401) {
          // 401 = chưa đăng nhập / token hết hạn → đăng nhập lại rồi quay về đúng trang này
          sessionStorage.setItem('redirectAfterLogin', currentPath + window.location.search);
          window.location.replace('/login');
        } else {
          // 403 = đã đăng nhập nhưng không đủ quyền → đăng nhập lại cũng không giải quyết được
          window.location.replace('/unauthorized');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
