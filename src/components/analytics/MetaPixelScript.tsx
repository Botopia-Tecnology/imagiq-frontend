"use client";

import { useEffect, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";

/**
 * Meta Pixel (Facebook) - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de marketing
 */
export default function MetaPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const loadMetaPixel = () => {
      // Verificar consentimiento
      if (!hasMarketingConsent()) {
        return;
      }

      // Usar ruta relativa para que Next.js proxy redirija al backend
      const metaPixelUrl = "/api/custommer/analytics/meta-pixel.js";

      // Verificar si ya existe
      if (document.querySelector(`script[src="${metaPixelUrl}"]`)) {
        return;
      }

      // Crear script
      const script = document.createElement("script");
      script.src = metaPixelUrl;
      script.async = true;
      script.id = "meta-pixel-bootstrap";

      script.onload = () => {
        // Meta Pixel loaded successfully
      };

      script.onerror = () => {
        // Solo mostrar error si no estamos en desarrollo sin backend
        if (process.env.NODE_ENV === "production") {
          console.error("[Meta Pixel] ❌ Failed to load from", metaPixelUrl);
        } else {
          console.warn(
            "[Meta Pixel] ⚠️ Backend not available (development mode)"
          );
        }
      };

      document.head.appendChild(script);

      // Noscript fallback
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src = "/api/custommer/analytics/meta-pixel/noscript";
      img.alt = "";
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    };

    // Cargar inmediatamente
    loadMetaPixel();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      loadMetaPixel();
    };

    window.addEventListener("consentChange", handleConsentChange);

    return () => {
      window.removeEventListener("consentChange", handleConsentChange);
      document.getElementById("meta-pixel-bootstrap")?.remove();
    };
  }, [mounted]);

  return null;
}
