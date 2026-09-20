// src/components/chat/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { SendHorizonal, MessageSquare } from "lucide-react";
import { useSocket } from "~/contexts/SocketContext";
import { getMessagesByRoom } from "~/services/messageService";

const ChatWindow = ({ self, peer, role }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const prevLength = useRef(0);
  const messagesContainerRef = useRef(null);

  // auto scroll to bottom on new message
  useEffect(() => {
    if (messages.length > prevLength.current && messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
    prevLength.current = messages.length;
  }, [messages]);


  // join room + listeners
  useEffect(() => {
    if (!socket || !self?._id || !peer?._id) return;
    const roomId = [self._id, peer._id].sort().join("-");

    socket.emit("joinRoom", roomId);

    // dùng service load lịch sử
    getMessagesByRoom(roomId)
      .then((res) => setMessages(res.data.data || []))
      .catch((err) => console.error("❌ Load messages failed:", err));

    const handleReceive = (msg) => {
      if (msg.room === roomId) setMessages((prev) => [...prev, msg]);
    };

    const handleTyping = ({ roomId: r }) => {
      if (r === roomId) {
        setIsTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("receiveMessage", handleReceive);
      socket.off("userTyping", handleTyping);
    };
  }, [socket, self?._id, peer?._id]);

  const handleTypingInput = (e) => {
    setText(e.target.value);
    if (!socket || !self?._id || !peer?._id) return;
    const roomId = [self._id, peer._id].sort().join("-");
    socket.emit("typing", roomId);
  };

  const sendMessage = () => {
    if (!text.trim() || !socket) return;
    const roomId = [self._id, peer._id].sort().join("-");
    const payload = { room: roomId, sender: self._id, text, senderRole: role };
    socket.emit("sendMessage", payload);
    setText("");
  };

  if (!peer)
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/40 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500 shadow-xs">
          <MessageSquare size={24} />
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-300 text-base">Chưa chọn cuộc trò chuyện</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Chọn {role === "pt" ? "học viên" : "huấn luyện viên"} từ danh sách bên trái để bắt đầu trao đổi lịch tập và chế độ ăn.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full h-full overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex-shrink-0 transition-colors">
        <img
          src={peer.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
        />
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">{peer.name}</h2>
          {isTyping && (
            <p className="text-xs text-blue-500 animate-pulse">Đang soạn tin nhắn...</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-slate-50/40 dark:bg-slate-950/70 transition-colors">
        {messages.map((msg, idx) => {
          const senderId = msg.sender?._id || msg.sender || msg.senderId;
          const mine = String(senderId) === String(self._id);
          return (
            <div
              key={idx}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-xs ${mine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-transparent dark:border-slate-700/60"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900 flex-shrink-0 transition-colors">
        <input
          value={text}
          onChange={handleTypingInput}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-full px-4 py-2 flex items-center justify-center shadow-xs"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
