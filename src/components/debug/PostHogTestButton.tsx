"use client";
/**
 * 🧪 COMPONENTE DE PRUEBA POSTHOG
 * 
 * Botón flotante para probar la conexión con PostHog.
 * Solo se muestra cuando NEXT_PUBLIC_POSTHOG_MANUAL_TEST=true en .env
 * 
 * Uso: Importar y añadir en cualquier página para testing
 */

import { useState } from "react";
import { posthogUtils } from "@/lib/posthogClient";

export default function PostHogTestButton() {
  const [eventCount, setEventCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const handleTestEvent = () => {
    const eventName = "manual_test_event";
    const timestamp = new Date().toISOString();
    
    posthogUtils.capture(eventName, {
      test_number: eventCount + 1,
      timestamp,
      source: "PostHogTestButton",
      message: `Evento de prueba manual #${eventCount + 1}`,
      user_agent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
    });

    setEventCount((prev) => prev + 1);
    setLastEvent(timestamp);
    
    console.log(`🧪 PostHog test event #${eventCount + 1} captured:`, eventName);
  };

  // Solo mostrar si la variable de entorno NEXT_PUBLIC_POSTHOG_MANUAL_TEST está habilitada
  if (process.env.NEXT_PUBLIC_POSTHOG_MANUAL_TEST !== "true") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {/* Info panel */}
      {lastEvent && (
        <div className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold">✅ Evento enviado!</p>
          <p className="opacity-80">Total: {eventCount} eventos</p>
          <p className="opacity-60 text-[10px] truncate">Último: {lastEvent}</p>
        </div>
      )}
      
      {/* Test button */}
      <button
        onClick={handleTestEvent}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span className="text-lg">🧪</span>
        <span className="text-sm">Test PostHog</span>
      </button>
      
      {/* Instructions */}
      <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-70 max-w-[200px]">
        Click para enviar un evento de prueba. Verifica en PostHog Dashboard → Activity/Events
      </div>
    </div>
  );
}
