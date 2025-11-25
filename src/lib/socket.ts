"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(channel: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      transports: ["websocket", "polling"],
      query: { channel },
      withCredentials: true,
    });
    

    socket.on("connect", () => {
      console.log("🟢 Socket conectado:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket desconectado");
    });
  }

  return socket;
}
