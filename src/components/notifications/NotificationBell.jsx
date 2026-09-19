// src/components/notifications/NotificationBell.jsx
import { useEffect, useRef, useState } from "react";
import { useNotification } from "~/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthProvider";
import { useTheme } from "~/contexts/ThemeContext";
import axiosClient from "~/api/axiosClient";

export default function NotificationBell({ variant = "light" }) {
  const { items, unread, markAllRead, markOneReadLocal } = useNotification();
  const { user } = useAuth();
  const { isDark: themeIsDark } = useTheme();
  const bellRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isDark = variant === "dark" || themeIsDark;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickNotification = (n) => {
    console.log("[Notification click]", n);

    const notiId = n._id || n.id;
    const data = n.meta || n.data || {};

    // 1) Cập nhật UI ngay
    if (!n.read && notiId) {
      markOneReadLocal(notiId);
      // và bắn API (không chờ kết quả)
      axiosClient
        .patch(`/notifications/${notiId}/read`)
        .catch((err) =>
          console.error("❌ mark notification read error:", err)
        );
    }

    // 2) Có url thì đi thẳng
    if (data.url) {
      navigate(data.url);
      setOpen(false);
      return;
    }

    if (!user?._id) return;
    const selfId = String(user._id);
    const basePath = user.role === "pt" ? "/pt/chat" : "/chat";

    // 3) Lấy peer từ room
    let peerId = null;
    const roomId = data.room || data.chatId;
    if (roomId) {
      const parts = String(roomId).split("-");
      peerId = parts.find((p) => p && p !== selfId) || parts[0] || null;
    }

    // 4) Fallback: senderId
    if (!peerId && data.senderId) {
      peerId = String(data.senderId);
    }

    if (peerId) {
      navigate(`${basePath}?peer=${peerId}`);
      setOpen(false);
      return;
    }

    console.warn("⚠️ Notification không có room / senderId để điều hướng:", n);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative p-2 rounded-full ${
          isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
        }`}
        aria-label="Notifications"
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 fill-current ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          <path d="M12 2a6 6 0 00-6 6v3.586L4.293 13.293A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-96 max-h-[70vh] overflow-auto rounded-xl z-50
          ${
            isDark
              ? "border border-white/10 bg-slate-900 text-slate-50 shadow-lg"
              : "border border-gray-200 bg-white text-gray-900 shadow-lg"
          }`}
        >
          <div
            className={`flex items-center justify-between px-3 py-2 border-b ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <span className="font-semibold">Thông báo</span>
            <button
              onClick={markAllRead}
              className={`text-sm ${
                isDark ? "text-orange-400" : "text-blue-600"
              } hover:underline`}
            >
              Đánh dấu đã đọc
            </button>
          </div>

          <ul className={isDark ? "divide-y divide-white/5" : "divide-y"}>
            {items.length === 0 && (
              <li
                className={`p-4 text-sm ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Không có thông báo
              </li>
            )}

            {items.map((n) => (
              <li key={n.id || n._id} className="p-0">
                <button
                  type="button"
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-left p-3 cursor-pointer ${
                    isDark ? "hover:bg-slate-800/60" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${
                        n.read
                          ? isDark
                            ? "bg-slate-500"
                            : "bg-gray-300"
                          : isDark
                          ? "bg-orange-400"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{n.title}</div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        {n.message}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          isDark ? "text-slate-500" : "text-gray-400"
                        }`}
                      >
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
           {/* 🔸 Nút View all notifications ở cuối */}
          {items.length > 0 && (
            <div
              className={`sticky bottom-0 text-center py-2.5 border-t ${
                isDark ? "bg-slate-900/95 border-slate-800" : "bg-gray-50 border-gray-100"
              }`}
            >
              <a
                href="/notifications"
                onClick={() => setOpen(false)}
                className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
