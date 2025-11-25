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
    

    socket.on("connect", () => {
      console.log("🟢 Socket conectado:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket desconectado:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión:", error.message);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconectado después de", attemptNumber, "intentos");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Intento de reconexión #", attemptNumber);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Error en reconexión:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconexión fallida después de todos los intentos");
    });
  }

  return socket;
}
