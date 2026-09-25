import React from 'react';
import { Link } from 'react-router-dom';
import ErrorLayout, { primaryButtonClass, secondaryButtonClass } from './ErrorLayout';

// Trang 403: đã đăng nhập nhưng không đủ quyền (PrivateRoute sai role, hoặc API trả 403).
export default function UnauthorizedPage() {
  return (
    <ErrorLayout
      badge={
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      }
      title="Không có quyền truy cập"
      actions={
        <>
          <Link to="/home" className={primaryButtonClass}>Về trang chủ</Link>
          <Link to="/login" className={secondaryButtonClass}>Đăng nhập lại</Link>
        </>
      }
    >
      <p>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.</p>
    </ErrorLayout>
  );
}