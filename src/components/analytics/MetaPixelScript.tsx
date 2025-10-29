'use client';

import { useEffect, useState } from 'react';

/**
 * Componente que carga el bootstrap script de Meta Pixel (Facebook Pixel)
 * desde nuestro backend proxy (first-party).
 *
 * El script solo se carga si:
 * 1. ENABLE_META_PIXEL=true en el backend
 * 2. El usuario ha dado consentimiento (no hay header x-analytics-consent: deny)
 *
 * IMPORTANTE: Este componente carga el script de Meta Pixel de forma dinámica
 * ejecutando el código JavaScript que viene del backend.
 *
 * @example
 * ```tsx
 * // En layout.tsx
 * <body>
 *   <MetaPixelScript />
 * </body>
 * ```
 */
export default function MetaPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!mounted) return;
    if (globalThis.window === undefined) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const metaPixelUrl = `${apiUrl}/api/custommer/analytics/meta-pixel.js`;

    // Verificar si ya existe el script
    const existingScript = document.querySelector(
      `script[src="${metaPixelUrl}"]`
    );
    if (existingScript) {
      console.debug('[Meta Pixel] Script already exists in DOM');
      return;
    }

    // Crear y cargar el script de forma dinámica
    const script = document.createElement('script');
    script.src = metaPixelUrl;
    script.async = true;
    script.id = 'meta-pixel-bootstrap';

    script.onload = () => {
      console.debug('[Meta Pixel] Script loaded successfully');
    };

    script.onerror = () => {
      console.warn(
        '[Meta Pixel] Failed to load from backend. Ensure the API is running at:',
        apiUrl
      );
    };

    // Insertar el script en el head
    document.head.appendChild(script);

    // Agregar noscript fallback para Meta Pixel
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `${apiUrl}/api/custommer/analytics/meta-pixel/noscript`;
    img.alt = '';
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('meta-pixel-bootstrap');
      scriptToRemove?.remove();
      noscript?.remove();
    };
  }, [mounted]);

  // Este componente no renderiza nada visible
  return null;
}
