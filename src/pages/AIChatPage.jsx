import MainLayout from "~/layouts/MainLayout";
import ChatAIWindow from "~/components/chat/ChatAIWindow";
import { Bot, Sparkles } from "lucide-react";

export default function AIChatPage() {
  return (
    <MainLayout>
      <div className="pt-[100px] px-4 sm:px-6 pb-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-200/60 dark:border-blue-900/50">
            <Sparkles size={13} className="text-blue-500" /> Trợ Lý Thể Hình Thông Minh
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-2.5">
            <Bot className="text-blue-500 w-7 h-7" /> Chat với trợ lý FitLink AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Hỏi đáp lịch tập, thực đơn dinh dưỡng, phục hồi cơ bắp và lộ trình cá nhân hóa dựa trên dữ liệu chuẩn PT.
          </p>
        </div>

        <div className="max-w-5xl mx-auto h-[72vh]">
          <ChatAIWindow />
        </div>
      </div>
    </MainLayout>
  );
}
