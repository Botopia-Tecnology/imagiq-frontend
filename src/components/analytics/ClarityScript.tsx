"use client";

import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/consent";

/**
 * Microsoft Clarity - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de analytics
 */
export default function ClarityScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const loadClarity = () => {
      // Verificar consentimiento
      if (!hasAnalyticsConsent()) {
        console.log("[Clarity] ❌ No analytics consent, skipping");
        return;
      }

      // Prevenir múltiples cargas
      if ("clarity" in window && window.clarity) {
        console.log("[Clarity] ✅ Already initialized");
        return;
      }

      // Usar ruta relativa para que Next.js proxy redirija al backend
      const clarityUrl = "/api/custommer/analytics/clarity.js";

      // Verificar si ya existe el script
      if (document.querySelector(`script[src="${clarityUrl}"]`)) {
        console.log("[Clarity] ✅ Already loaded");
        return;
      }

      console.log("[Clarity] 📦 Loading script...");

      // Crear script
      const script = document.createElement("script");
      script.src = clarityUrl;
      script.async = true;
      script.id = "clarity-bootstrap";

      script.onload = () => {
        console.log("[Clarity] ✅ Loaded successfully");
        if ("clarity" in window && window.clarity) {
          console.log("[Clarity] ✅ window.clarity available");
        }
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

    // Cargar inmediatamente
    loadClarity();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      console.log("[Clarity] 🔄 Consent changed");
      loadClarity();
    };

    window.addEventListener("consentChange", handleConsentChange);

    return () => {
      window.removeEventListener("consentChange", handleConsentChange);
      document.getElementById("clarity-bootstrap")?.remove();
    };
  }, [mounted]);

  return null;
}
