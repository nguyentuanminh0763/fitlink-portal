// src/api/socket.js
import { io } from "socket.io-client";

const backendURL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

const socket = io(backendURL, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
