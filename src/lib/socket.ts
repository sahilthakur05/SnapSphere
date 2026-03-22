import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(_userId?: string) {
  if (socket?.connected) return socket;

  // If socket exists but is still connecting, return it
  if (socket) return socket;

  const token = localStorage.getItem("token");

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    auth: { token }, // send JWT for server-side verification
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000, // exponential backoff caps at 10s
  });

  if (import.meta.env.DEV) {
    socket.on("connect", () => console.log("Socket connected:", socket?.id));
    socket.on("connect_error", (err) => console.log("Socket connect error:", err.message));
    socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
