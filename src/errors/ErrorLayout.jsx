import React from 'react';

// Khung chung cho mọi màn hình lỗi (404, 403, lỗi render) — đổi giao diện trang lỗi chỉ sửa ở đây.
export const primaryButtonClass =
  'block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200';
export const secondaryButtonClass =
  'block w-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md transition duration-200';

export default function ErrorLayout({ badge, title, children, actions }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
        {badge && <div className="mb-4">{badge}</div>}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
        <div className="text-gray-600 dark:text-slate-300 mb-6">{children}</div>
        <div className="space-y-3">{actions}</div>
      </div>
    </div>
  );
}
