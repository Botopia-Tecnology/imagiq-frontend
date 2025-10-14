'use client';

import Script from 'next/script';

/**
 * Componente que carga el bootstrap script de Meta Pixel (Facebook Pixel)
 * desde nuestro backend proxy (first-party).
 *
 * El script solo se carga si:
 * 1. ENABLE_META_PIXEL=true en el backend
 * 2. El usuario ha dado consentimiento (no hay header x-analytics-consent: deny)
 *
 * @example
 * ```tsx
 * // En layout.tsx
 * <head>
 *   <MetaPixelScript />
 * </head>
 * ```
 */
export default function MetaPixelScript() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <>
      <Script
        src={`${apiUrl}/api/analytics/meta-pixel.js`}
        strategy="afterInteractive"
        id="meta-pixel-bootstrap"
      />
      {/* Noscript fallback para rastreo sin JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`${apiUrl}/api/analytics/meta-pixel/noscript`}
          alt=""
        />
      </noscript>
    </>
  );
}
