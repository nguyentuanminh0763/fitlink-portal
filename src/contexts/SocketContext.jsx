// src/contexts/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../api/socket";
import { useAuth } from "./AuthProvider";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Mở/đóng socket theo vòng đời user, rồi đăng ký user room sau khi connect.
  // Cần thiết vì socket dùng autoConnect: false và server từ chối handshake
  // không có JWT cookie — lỗi middleware không kích hoạt reconnect tự động.
  useEffect(() => {
    if (!user?._id) {
      socket.disconnect();
      return;
    }

    const register = () => socket.emit("registerUser", user._id);
    socket.on("connect", register);
    if (socket.connected) register();
    else socket.connect();

    return () => socket.off("connect", register);
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
