import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorLayout, { primaryButtonClass, secondaryButtonClass } from './ErrorLayout';

// Trang 404 cho mọi đường dẫn không khớp route nào (route "*" trong AppRouter).
// Trước đây route "*" âm thầm chuyển về /home, nên người dùng không biết link bị hỏng
// và dev cũng không phát hiện được link sai trong code.
export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ErrorLayout
      badge={<p className="text-6xl font-extrabold text-orange-500">404</p>}
      title="Không tìm thấy trang"
      actions={
        <>
          <Link to="/home" className={primaryButtonClass}>Về trang chủ</Link>
          <button type="button" onClick={() => navigate(-1)} className={secondaryButtonClass}>Quay lại</button>
        </>
      }
    >
      <p className="mb-2">Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
      <p className="text-sm text-gray-400 dark:text-slate-500 break-all">{location.pathname}</p>
    </ErrorLayout>
  );
}
