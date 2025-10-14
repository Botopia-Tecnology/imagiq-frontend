'use client';

import Script from 'next/script';

/**
 * Componente que carga Google Tag Manager de forma first-party
 *
 * - No requiere variables de entorno en el frontend
 * - El Container ID vive solo en el backend
 * - Soporta consentimiento a través del header x-analytics-consent
 * - Totalmente first-party para evitar ad-blockers
 */
export default function GTMScript() {
  // Obtener la URL base del API desde variables de entorno
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <>
      {/* Script principal de GTM */}
      <Script
        src={`${apiUrl}/api/analytics/gtm.js`}
        strategy="afterInteractive"
        id="gtm-bootstrap"
      />

      {/* NoScript fallback para GTM */}
      <noscript>
        <iframe
          src={`${apiUrl}/api/analytics/gtm/noscript`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
