// src/components/chat/ChatAIWindow.jsx
import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal, Bot, User } from "lucide-react";
import { sendAIChat } from "~/services/aiChatService";

const ChatAIWindow = () => {
  // messages ở FE: { role: 'user' | 'assistant', content: '...' }
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI FitLink. Bạn cần tư vấn về lịch tập luyện, chế độ dinh dưỡng hay phân tích mục tiêu thể hình hôm nay?",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || loading) return;

    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setText("");
    setLoading(true);

    try {
      const reply = await sendAIChat(newMessages);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Xin lỗi, hiện tại hệ thống AI đang quá tải. Bạn vui lòng thử lại sau giây lát nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 transition-colors">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Trợ lý AI FitLink</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hỏi mọi thứ về tập luyện, dinh dưỡng, recovery...
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/50 dark:bg-slate-950/70 transition-colors">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[75%] items-start gap-2`}>
                {!isUser && (
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-xs ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80"
                  }`}
                >
                  {msg.content}
                </div>
                {isUser && (
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-700 text-white shrink-0">
                    <User size={14} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-9">
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" />
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce delay-150" />
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce delay-300" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex items-center gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Đặt câu hỏi cho trợ lý AI..."
            className="flex-1 resize-none bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 disabled:opacity-50 hover:bg-blue-700 transition text-white rounded-full px-4 py-2.5 flex items-center justify-center shadow-xs"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIWindow;
