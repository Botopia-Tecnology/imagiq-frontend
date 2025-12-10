"use client";

import { useEffect, useState } from "react";
import {
  initializeClarityConsent,
  sendClarityConsentToBackend,
} from "@/lib/analytics/clarity-consent";

/**
 * Microsoft Clarity - First-Party Loading
 *
 * Se carga SIEMPRE para grabar todas las sesiones
 * No requiere consentimiento de cookies
 */
export default function ClarityScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Inicializar el consentimiento (habilitado por defecto)
    initializeClarityConsent();
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
        console.log("[Clarity] ✅ Loaded successfully - Recording enabled");

        // Enviar consentimiento de grabación al backend
        sendClarityConsentToBackend(true);
      };

      script.onerror = () => {
        // Solo mostrar error si no estamos en desarrollo sin backend
        if (process.env.NODE_ENV === "production") {
          console.error("[Clarity] ❌ Failed to load from", clarityUrl);
        } else {
          console.warn("[Clarity] ⚠️ Backend not available (development mode)");
        }
      };

      document.head.appendChild(script);
    };

    // Cargar inmediatamente - SIN verificar consentimiento
    loadClarity();

    return () => {
      document.getElementById("clarity-bootstrap")?.remove();
    };
  }, [mounted]);

  return null;
}
