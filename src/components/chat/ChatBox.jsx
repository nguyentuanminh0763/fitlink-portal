import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { messageApi } from "../../api/messageApi";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatBox = ({ chatId, currentUser }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    messageApi.getMessages(chatId).then(res => setMessages(res.data));

    socket.emit("join_room", chatId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, [chatId, socket]);

  const handleSend = async (text) => {
    const newMsg = { chat: chatId, sender: currentUser._id, text };
    const res = await messageApi.sendMessage(newMsg);
    socket.emit("send_message", res.data);
    setMessages([...messages, res.data]);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMine={msg.sender === currentUser._id}
          />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
