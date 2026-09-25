import React from 'react';
import ErrorLayout, { primaryButtonClass, secondaryButtonClass } from './ErrorLayout';

// Lỗi tải file JS của trang lazy: thường gặp ngay sau deploy, khi trình duyệt còn giữ
// index.html cũ trỏ tới file hash đã bị xoá. Chrome/Firefox/Safari báo bằng câu khác nhau.
const CHUNK_ERROR_PATTERNS = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
];
const RELOAD_GUARD_KEY = 'chunk-reload-at';
const RELOAD_GUARD_MS = 10_000;

const isChunkLoadError = (error) =>
  CHUNK_ERROR_PATTERNS.some((pattern) => String(error?.message).includes(pattern));

// Bắt lỗi khi render (component crash, lazy import thất bại) để không hiện màn hình trắng.
// Phải là class component: React chưa có hook thay cho getDerivedStateFromError/componentDidCatch.
// Không bắt được lỗi trong event handler / request API — những lỗi đó do axios interceptor xử lý.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('❌ [UI] Lỗi render:', error, info?.componentStack);

    // Tải lại đúng 1 lần để lấy index.html mới. Chốt thời gian tránh reload vô hạn
    // nếu file thật sự không tồn tại.
    if (isChunkLoadError(error)) {
      const lastReload = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) || 0);
      if (Date.now() - lastReload > RELOAD_GUARD_MS) {
        sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
        window.location.reload();
      }
    }
  }

  componentDidUpdate(prevProps) {
    // Người dùng chuyển sang trang khác → xoá lỗi để trang mới render bình thường
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <ErrorLayout
        title="Đã có lỗi xảy ra"
        actions={
          <>
            <button type="button" onClick={() => window.location.reload()} className={primaryButtonClass}>
              Tải lại trang
            </button>
            {/* Dùng <a> (tải lại toàn trang) thay vì <Link> để xoá sạch trạng thái đang lỗi */}
            <a href="/home" className={secondaryButtonClass}>Về trang chủ</a>
          </>
        }
      >
        <p>Trang này gặp sự cố khi hiển thị. Bạn thử tải lại trang, nếu vẫn lỗi hãy quay về trang chủ.</p>
      </ErrorLayout>
    );
  }
}
