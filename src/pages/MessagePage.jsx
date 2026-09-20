import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import MainLayout from "~/layouts/MainLayout";
import ChatSidebar from "~/components/chat/ChatSidebar";
import ChatWindow from "~/components/chat/ChatWindow";
import { useAuth } from "~/contexts/AuthProvider";
import { getMyPTs } from "~/services/messageService";

export default function MessagePage() {
  const { user } = useAuth();
  const [pts, setPts] = useState([]);
  const [active, setActive] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const peerIdFromUrl = searchParams.get("peer");

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        const res = await getMyPTs(); // { success, data }
        const raw = res.data?.data || res.data || [];

        // 🔧 Đảm bảo mỗi PT có name / displayName
        const list = raw.map((pt) => {
          const displayName = pt.fullName || pt.name || "Không rõ tên";
          return {
            ...pt,
            name: displayName,          // để ChatSidebar/ChatWindow dùng
            fullName: displayName,      // phòng khi component dùng fullName
            displayName,
          };
        });

        setPts(list);
      } catch (err) {
        console.error("❌ Lỗi khi tải PT:", err);
      }
    })();
  }, [user?._id]);

  useEffect(() => {
    if (!peerIdFromUrl || !pts.length) return;
    const found = pts.find(
      (p) => String(p._id) === String(peerIdFromUrl)
    );
    if (found) setActive(found);
  }, [peerIdFromUrl, pts]);

  return (
    <MainLayout>
      <section className="px-4 sm:px-6 pt-6 pb-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-2.5">
            <FaComments className="text-orange-500 w-7 h-7" /> Tin nhắn của bạn
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Trò chuyện trực tiếp với huấn luyện viên cá nhân của bạn
          </p>
        </div>

        {/* Chat box */}
        <div className="max-w-6xl mx-auto flex rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900 min-h-[65vh] max-h-[calc(100vh-5rem-3rem)]">
          {/* Sidebar */}
          <div className="w-[300px] border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
            <ChatSidebar
              list={pts}
              role="student"
              activeId={active?._id}
              onSelect={setActive}
            />
          </div>

          {/* Chat window */}
          <div className="flex-1 min-h-0">
            <ChatWindow self={user} peer={active} role="student" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
