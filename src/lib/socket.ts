"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(channel: string): Socket {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/realtime`, {
      transports: ["websocket", "polling"],
      query: { channel },
      withCredentials: true,
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed after all attempts");
    });
  }

  return socket;
}
