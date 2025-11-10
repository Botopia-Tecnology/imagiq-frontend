"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

/**
 * Componente que inicializa el sistema de analytics
 *
 * Debe montarse una vez en el layout raíz para:
 * - Inicializar el sistema de detección de abandono
 * - Verificar abandonos pendientes del pasado
 * - Configurar listeners de eventos
 *
 * Este componente debe ejecutarse DESPUÉS de que los scripts
 * de GTM, Meta Pixel y TikTok se hayan cargado.
 */
export default function AnalyticsInit() {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    // Esperar 2 segundos para que los scripts se carguen
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.debug("[AnalyticsInit] Initializing analytics system");
      }
      initAnalytics();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
