import React, { useState } from "react";
import { CheckCircle, Info, Star, Gift } from "lucide-react";
import FeedbackDialog from "./student/FeedbackDialog";

export default function NotificationItem({ noti, onFeedbackSent }) {
  const [openFeedback, setOpenFeedback] = useState(false);

  // Card style by type
  const getTypeStyle = () => {
    switch (noti.type) {
      case "session":
        return "border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20";
      case "feedback":
        return "border-orange-200 dark:border-orange-900/50 bg-orange-50/60 dark:bg-orange-950/20";
      case "message":
        return "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20";
      default:
        return "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900";
    }
  };

  // Icon by type
  const getIcon = () => {
    if (noti.title?.includes("completed")) {
      return <Gift className="text-orange-500 w-5 h-5" />;
    }
    switch (noti.type) {
      case "session":
        return <CheckCircle className="text-blue-500 w-5 h-5" />;
      case "feedback":
        return <Star className="text-orange-500 w-5 h-5" />;
      default:
        return <Info className="text-slate-400 dark:text-slate-500 w-5 h-5" />;
    }
  };

  // Determine status & note from meta
  const status =
    noti.meta?.status ||
    (noti.message?.toLowerCase().includes("completed") ? "completed" : "");
  const note = noti.meta?.ptNote || "";

  // Render different messages
  const renderMessage = () => {
    // Completed all sessions (feedback request)
    if (noti.title?.toLowerCase().includes("completed package")) {
      return (
        <div className="text-center text-slate-800 dark:text-slate-200 text-sm leading-relaxed py-1">
          <p className="text-base font-bold text-orange-600 dark:text-orange-400 mb-1">
            Chúc mừng bạn đã hoàn thành gói tập!
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Bạn đã hoàn thành tất cả các buổi tập theo kế hoạch. Hãy để lại đánh giá cho huấn luyện viên nhé.
          </p>
        </div>
      );
    }

    // Session update
    if (noti.type === "session") {
      return (
        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">Trạng thái:</span>
            {status === "completed" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Hoàn thành
              </span>
            ) : status === "missed" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                Vắng mặt
              </span>
            ) : status === "upcoming" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                Sắp diễn ra
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {status || "Cập nhật"}
              </span>
            )}
          </div>
          {note && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ghi chú của HLV:</span> {note}
            </p>
          )}
        </div>
      );
    }

    // Other notification types
    return (
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
        {noti.message}
      </p>
    );
  };

  return (
    <div
      className={`border ${getTypeStyle()} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        {getIcon()}
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          {noti.title || "Thông báo"}
        </h3>
      </div>

      {/* Message content */}
      {renderMessage()}

      {/* Timestamp */}
      <small className="text-slate-400 dark:text-slate-500 text-xs mt-3 block text-right">
        {new Date(noti.createdAt).toLocaleString("vi-VN")}
      </small>

      {/* Feedback button */}
      {noti.meta?.feedbackRequest && !noti.meta?.feedbackSent && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setOpenFeedback(true)}
            className="px-4 py-1.5 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-sm transition-all"
          >
            Give Feedback
          </button>
        </div>
      )}

      {/* Feedback dialog */}
      <FeedbackDialog
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
        ptId={noti.meta?.ptId}
        notiId={noti._id}
        notiMeta={noti.meta}
        onFeedbackSent={onFeedbackSent}
      />
    </div>
  );
}
