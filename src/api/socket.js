// src/api/socket.js
import { io } from "socket.io-client";

const backendURL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

// autoConnect: false — server xác thực JWT cookie ngay tại handshake, mà lúc
// module này được import thì chưa biết user là ai. SocketProvider sẽ gọi
// connect()/disconnect() theo vòng đời user.
const socket = io(backendURL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
