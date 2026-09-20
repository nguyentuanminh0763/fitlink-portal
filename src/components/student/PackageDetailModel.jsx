// src/components/student/PackageDetailModal.jsx
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const formatVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN")
    : typeof n === "string" && !Number.isNaN(Number(n))
    ? Number(n).toLocaleString("vi-VN")
    : "-";

export default function PackageDetailModal({ pkg, onClose }) {
  const [agree, setAgree] = useState(true);
  const navigate = useNavigate();
  const { id: ptIdFromRoute } = useParams();

  const ptId = pkg?.pt?._id || pkg?.ptId || pkg?.pt || ptIdFromRoute;

  const pricePerSession = useMemo(() => {
    if (!pkg?.price || !pkg?.totalSessions) return null;
    const raw = Number(pkg.price) / Number(pkg.totalSessions);
    if (!Number.isFinite(raw)) return null;
    return Math.round(raw);
  }, [pkg?.price, pkg?.totalSessions]);

  const handleGoBooking = () => {
    if (!ptId) {
      console.error("Missing PT id for booking");
      return;
    }
    const search = new URLSearchParams();
    if (pkg?._id) search.set("packageId", pkg._id);

    navigate(`/booking/${ptId}?${search.toString()}`);
  };

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-6">
      <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
              Chương trình huấn luyện
            </p>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {pkg.name}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-right">
              <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Học phí trọn gói
              </div>
              <div className="text-2xl font-black text-orange-500">
                {formatVND(pkg.price)}{" "}
                <span className="text-xs font-semibold text-orange-500 ml-1">
                  VND
                </span>
              </div>
              {pricePerSession && (
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  ~ {formatVND(pricePerSession)} VND / buổi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body: 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* LEFT – mô tả */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mô tả chi tiết giáo án
              </h4>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {pkg.description ? (
                  <p className="whitespace-pre-line">{pkg.description}</p>
                ) : (
                  <p className="text-slate-400 italic">Chưa có mô tả chi tiết.</p>
                )}
              </div>
            </div>

            {Array.isArray(pkg.tags) && pkg.tags.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mục tiêu trọng tâm
                </div>
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT – info + điều khoản */}
          <div className="space-y-4">
            {/* Thông tin chính */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Thời hạn</div>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {pkg.durationDays || pkg.duration || "-"} ngày
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Số buổi</div>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {pkg.totalSessions || "-"} buổi
                  </div>
                </div>
                {pkg.sessionDurationMin && (
                  <div className="col-span-2">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      Thời lượng mỗi buổi
                    </div>
                    <div className="mt-0.5 font-bold text-slate-900 dark:text-white">
                      {pkg.sessionDurationMin} phút / buổi
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-2.5">
                Giáo án chi tiết, video hướng dẫn bài tập và thực đơn dinh dưỡng sẽ được mở khóa ngay sau khi gói được kích hoạt thành công.
              </p>
            </div>

            {/* Điều khoản */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-xs">
              <div className="font-bold text-slate-900 dark:text-white mb-2">
                Cam kết & Điều khoản thanh toán
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <li>Thanh toán qua cổng PayOS chuẩn bảo mật PCI-DSS.</li>
                <li>Được đổi HLV miễn phí nếu không hài lòng sau buổi trải nghiệm đầu.</li>
                <li>Gói tập có hiệu lực trong {pkg.durationDays || pkg.duration || "-"} ngày kể từ ngày kích hoạt.</li>
              </ul>
              <label className="mt-3 inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-xs">
                  Tôi đã đọc và đồng ý với điều khoản trên.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleGoBooking}
            disabled={!agree || !ptId}
            className="rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Mua gói & Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
}
