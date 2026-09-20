import React from 'react';
import { FaDumbbell } from 'react-icons/fa';

export default function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 transition-colors duration-200">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 animate-ping absolute" />
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 relative z-10 animate-bounce">
          <FaDumbbell className="text-2xl" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Đang tải trang...
        </span>
      </div>
    </div>
  );
}
