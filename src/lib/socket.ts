"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(channel: string): Socket {
  if (!socket) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/realtime`;
    console.log(`[Socket] Creating NEW socket -> ${url} (channel: ${channel})`);
    socket = io(url, {
      transports: ["websocket", "polling"],
      query: { channel },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(`[Socket] Connected! id: ${socket?.id}, channel: ${channel}`);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    socket.on("reconnect_error", (error) => {
      console.error("[Socket] Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("[Socket] Reconnection failed after all attempts");
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
    });

    // Debug: log ALL incoming events for products_updated
    socket.on("products_updated", (data: unknown) => {
      console.log(`[Socket] RAW products_updated event received:`, data);
    });
  } else {
    console.log(`[Socket] Reusing existing socket (id: ${socket.id}, original channel: ${socket.io.opts.query?.channel}, requested: ${channel})`);
  }

  return socket;
}
