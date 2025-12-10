"use client";

import { useEffect, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";

/**
 * TikTok Pixel - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de marketing
 */
export default function TikTokPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const loadTikTokPixel = () => {
      // Verificar consentimiento
      if (!hasMarketingConsent()) {
        return;
      }

      // Usar ruta relativa para que Next.js proxy redirija al backend
      const tiktokPixelUrl = "/api/custommer/analytics/tiktok-pixel.js";

      // Verificar si ya existe
      if (document.querySelector(`script[src="${tiktokPixelUrl}"]`)) {
        return;
      }

      // Crear script
      const script = document.createElement("script");
      script.src = tiktokPixelUrl;
      script.async = true;
      script.id = "tiktok-pixel-bootstrap";

      script.onload = () => {
        // TikTok Pixel loaded successfully
      };

      script.onerror = () => {
        // Solo mostrar error si no estamos en desarrollo sin backend
        if (process.env.NODE_ENV === "production") {
          console.error(
            "[TikTok Pixel] ❌ Failed to load from",
            tiktokPixelUrl
          );
        } else {
          console.warn(
            "[TikTok Pixel] ⚠️ Backend not available (development mode)"
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
      img.src = "/api/custommer/analytics/tiktok-pixel/noscript";
      img.alt = "";
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    };

    // Cargar inmediatamente
    loadTikTokPixel();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      loadTikTokPixel();
    };

    window.addEventListener("consentChange", handleConsentChange);

    return () => {
      window.removeEventListener("consentChange", handleConsentChange);
      document.getElementById("tiktok-pixel-bootstrap")?.remove();
    };
  }, [mounted]);

  return null;
}
