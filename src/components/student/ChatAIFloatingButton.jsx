import { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import ChatAIWindow from "~/components/chat/ChatAIWindow"; // ✅ dùng lại component sẵn có

export default function ChatAIFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔘 Nút mở chat */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6
          bg-gradient-to-r from-blue-500 to-indigo-600
          hover:from-blue-600 hover:to-indigo-700
          text-white p-4 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300 hover:scale-110
          z-50
        "
        title="Chat với AI"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Popup chat */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6
            w-[380px] h-[520px] max-w-[calc(100vw-2rem)]
            bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl
            z-[9999] flex flex-col overflow-hidden
            animate-fadeIn transition-colors
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-sm">FitLink AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-white"
              aria-label="Close"
            >
              <FaTimes size={15} />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
            <ChatAIWindow />
          </div>
        </div>
      )}
    </>
  );
}
