// src/components/pt/SessionDrawer.jsx
import Avatar from "~/components/Avatar";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteSession, updateSessionStatus } from "~/services/sessionService"; // ✅ chỉ giữ 2 hàm thật sự dùng

export default function SessionDrawer({ open, onClose, eventData, onChanged }) {
  const [loading, setLoading] = useState(false);
  const session = eventData?.session;

  // ✅ State lưu PT Note
  const [ptNote, setPtNote] = useState(session?.ptNote || "");

  // ✅ Khi đổi session → cập nhật lại note
  useEffect(() => {
    setPtNote(session?.ptNote || "");
  }, [session]);

  const title = session?.title || "Buổi tập";
  const studentName = session?.student?.name || "Student";
  const studentAvatar = session?.student?.avatar;
  const pkgName = eventData?.sessionPackageName || "";

  const startStr = session?.startTime
    ? new Date(session.startTime).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";
  const endStr = session?.endTime
    ? new Date(session.endTime).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  // ✅ FIX CHÍNH: chỉ dùng 1 API updateSessionStatus
  const setStatus = async (status, attendance) => {
    if (!session?._id) return;
    try {
      setLoading(true);
      await updateSessionStatus(session._id, {
        ...(status ? { status } : {}),
        ...(attendance ? { attendance } : {}),
        ptNote: ptNote || "", // ✅ gửi kèm ghi chú
      });
      toast.success("Đã lưu thay đổi");
      onChanged?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!session?._id) return;
    if (!confirm("Xoá buổi này?")) return;
    try {
      setLoading(true);
      await deleteSession(session._id);
      toast.success("Đã xoá");
      onChanged?.();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Xoá thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Thêm hàm lưu riêng PT Note khi blur
  const saveNote = async () => {
    if (!session?._id) return;
    try {
      await updateSessionStatus(session._id, { ptNote });
      toast.success("Đã lưu ghi chú");
      onChanged?.();
    } catch {
      toast.error("Không lưu được ghi chú");
    }
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-[61] h-full w-full max-w-md transform bg-gray-900 border-l border-white/10 shadow-2xl transition-transform
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="text-white text-lg font-semibold">Chi tiết buổi tập</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
          >
            <FaTimes />
          </button>
        </div>

        <div className="h-[calc(100vh-56px)] overflow-y-auto p-4 space-y-4">
          {/* Student box */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <Avatar
              src={studentAvatar}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <div className="text-white font-medium">{studentName}</div>
              {pkgName && (
                <div className="text-xs text-gray-400">{pkgName}</div>
              )}
            </div>
          </div>

          {/* Title & time */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm text-gray-400">Tiêu đề</div>
            <div className="text-white font-semibold">{title}</div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Bắt đầu: </span>
                {startStr}
              </div>
              <div>
                <span className="text-gray-400">Kết thúc: </span>
                {endStr}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-sm text-gray-400">Trạng thái</div>
            <div className="flex flex-wrap gap-2">
              <Badge active={session?.status === "scheduled"}>scheduled</Badge>
              <Badge active={session?.status === "completed"}>completed</Badge>
              <Badge active={session?.status === "missed"}>missed</Badge>
              <Badge active={session?.status === "rescheduled"}>
                rescheduled
              </Badge>
              <Badge active={session?.status === "cancelled"}>cancelled</Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <ActionBtn
                disabled={loading}
                onClick={() => setStatus("completed", "present")}
              >
                Completed
              </ActionBtn>
              <ActionBtn
                disabled={loading}
                onClick={() => setStatus("missed", "absent")}
              >
                Missed
              </ActionBtn>
              <ActionBtn
                disabled={loading}
                onClick={() => setStatus("cancelled")}
              >
                Cancelled
              </ActionBtn>
              <button
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                disabled={loading}
                onClick={onDelete}
              >
                Deleted
              </button>
            </div>
          </div>

          {/* ✅ FIX: Thêm onBlur để auto-save PT Note */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <label className="block text-sm text-gray-300 mb-1">PT Note</label>
            <textarea
              value={ptNote}
              onChange={(e) => setPtNote(e.target.value)}
              onBlur={saveNote} // ✅ auto-save khi rời ô
              placeholder="Enter your note here..."
              className="w-full rounded-md bg-black/20 border border-white/10 p-2 text-sm text-white"
              rows={3}
            />
          </div>

          {/* Notes */}
          {!!session?.ptNote && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-sm text-gray-400">Ghi chú của PT</div>
              <div className="text-gray-200 text-sm whitespace-pre-wrap">
                {session.ptNote}
              </div>
            </div>
          )}
          {!!session?.studentNote && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-sm text-gray-400">
                Ghi chú của học viên
              </div>
              <div className="text-gray-200 text-sm whitespace-pre-wrap">
                {session.studentNote}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Badge component
function Badge({ children, active }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs ${
        active
          ? "bg-orange-500/30 text-orange-200"
          : "bg-white/10 text-gray-300"
      }`}
    >
      {children}
    </span>
  );
}

// Action button
function ActionBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
    >
      {children}
    </button>
  );
}
