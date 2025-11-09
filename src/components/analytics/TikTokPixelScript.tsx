'use client';

import { useEffect, useState } from 'react';
import { hasAdsConsent } from '@/lib/consent';

/**
 * Componente que carga el bootstrap script de TikTok Pixel
 * desde nuestro backend proxy (first-party).
 *
 * El script solo se carga si:
 * 1. ENABLE_TIKTOK_PIXEL=true en el backend
 * 2. El usuario ha dado consentimiento de cookies de marketing
 * 3. SOLO SE CARGA SI EL USUARIO ACEPTA COOKIES DE MARKETING
 *
 * IMPORTANTE: Este componente carga el script de TikTok Pixel de forma dinámica
 * ejecutando el código JavaScript que viene del backend.
 *
 * @example
 * ```tsx
 * // En layout.tsx
 * <body>
 *   <TikTokPixelScript />
 * </body>
 * ```
 */
export default function TikTokPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!mounted) return;
    if (globalThis.window === undefined) return;

    // ✅ VERIFICAR CONSENTIMIENTO DE MARKETING
    if (!hasAdsConsent()) {
      console.debug('[TikTok Pixel] No ads consent, skipping load');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const tiktokPixelUrl = `${apiUrl}/api/custommer/analytics/tiktok-pixel.js`;

    // Verificar si ya existe el script
    const existingScript = document.querySelector(
      `script[src="${tiktokPixelUrl}"]`
    );
    if (existingScript) {
      console.debug('[TikTok Pixel] Script already exists in DOM');
      return;
    }

    // Crear y cargar el script de forma dinámica
    const script = document.createElement('script');
    script.src = tiktokPixelUrl;
    script.async = true;
    script.id = 'tiktok-pixel-bootstrap';

    script.onload = () => {
      console.debug('[TikTok Pixel] Script loaded successfully');
    };

    script.onerror = () => {
      console.warn(
        '[TikTok Pixel] Failed to load from backend. Ensure the API is running at:',
        apiUrl
      );
    };

    // Insertar el script en el head
    document.head.appendChild(script);

    // Agregar noscript fallback para TikTok Pixel
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `${apiUrl}/api/custommer/analytics/tiktok-pixel/noscript`;
    img.alt = '';
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('tiktok-pixel-bootstrap');
      scriptToRemove?.remove();
      noscript?.remove();
    };
  }, [mounted]);

  // Este componente no renderiza nada visible
  return null;
}
