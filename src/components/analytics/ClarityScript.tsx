"use client";

import { useEffect, useState } from "react";
import {
  initializeClarityConsent,
  sendClarityConsentToBackend,
} from "@/lib/analytics/clarity-consent";
import { initializeSessionId } from "@/lib/analytics/clarity-identify";

/**
 * Microsoft Clarity - First-Party Loading
 *
 * Se carga SIEMPRE para grabar todas las sesiones
 * No requiere consentimiento de cookies
 *
 * IMPORTANTE: El script NO se elimina en cleanup para mantener
 * la grabación continua durante toda la sesión del usuario
 */
export default function ClarityScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Inicializar el consentimiento (habilitado por defecto)
    initializeClarityConsent();
    // Inicializar el sessionId desde el principio para mantener continuidad
    initializeSessionId();
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const loadClarity = () => {
      // Prevenir múltiples cargas
      if ("clarity" in window && window.clarity) {
        return;
      }

      // Usar ruta relativa para que Next.js proxy redirija al backend
      const clarityUrl = "/api/custommer/analytics/clarity.js";

      // Verificar si ya existe el script
      if (document.querySelector(`script[src="${clarityUrl}"]`)) {
        return;
      }

      // Crear script
      const script = document.createElement("script");
      script.src = clarityUrl;
      script.async = true;
      script.id = "clarity-bootstrap";

      script.onload = () => {
        // Enviar consentimiento de grabación al backend
        sendClarityConsentToBackend(true);
      };

      script.onerror = () => {
        // Error silencioso - Clarity no es crítico para la aplicación
      };

      document.head.appendChild(script);
    };

    // Cargar inmediatamente - SIN verificar consentimiento
    loadClarity();

    // NO eliminar el script en cleanup - Clarity debe seguir grabando
    // incluso durante navegaciones y re-renders de React
  }, [mounted]);

  return null;
}
